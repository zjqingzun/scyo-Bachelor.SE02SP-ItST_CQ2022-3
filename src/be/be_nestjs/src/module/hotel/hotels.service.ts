import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Hotel } from './entities/hotel.entity';
import { RoomType } from '../room_type/entites/room_type.entity';
import { Room } from '../room/entities/room.entity';
import { MinioService } from '@/minio/minio.service';

import { NotFoundException } from '@nestjs/common';
import { SearchHotelDto } from './dto/search-hotel.dto';
import { DetailHotelDto } from './dto/detail-hotel.dto';


@Injectable()
export class HotelsService {

  constructor(
    @InjectRepository(Hotel)
    private readonly hotelRepository: Repository<Hotel>,

    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,

    @InjectRepository(RoomType)
    private readonly roomTypeRepository: Repository<RoomType>,

    private readonly minioService: MinioService,
  ) { }

  create(createHotelDto: CreateHotelDto) {
    return 'This action adds a new hotel';
  }

  findAll() {
    return `This action returns all hotels`;
  }

  update(id: number, updateHotelDto: UpdateHotelDto) {
    return `This action updates a #${id} hotel`;
  }

  remove(id: number) {
    return `This action removes a #${id} hotel`;
  }

  // HOME - TOP 10 RATING HOTEL BY REVIEW
  async getTopTenRatingHotel() {
    try {
      const queryBuilder = await this.hotelRepository
        .createQueryBuilder('hotel')
        .leftJoinAndSelect('hotel.images', 'image')
        .leftJoinAndSelect('hotel.locations', 'location')
        .leftJoin('hotel.reviews', 'review')
        .leftJoin('hotel.roomTypes', 'roomType')
        .select([
          'hotel.id AS id',
          'hotel.name AS name',
          'hotel.star AS star',
          'location.detailAddress AS address',
          'ARRAY_AGG(image.url) AS images',
          'AVG(review.rating) AS averageRating',
          'COUNT(review.id) AS totalReviews',
          'MIN(roomType.price) AS minPrice',
        ])
        .groupBy('hotel.id')
        .addGroupBy('location.id')
        .orderBy('averageRating', 'DESC')
        .limit(10); // Lấy top 10 khách sạn chấm theo rating trung bình của người dùng 

      const hotels = await queryBuilder.getRawMany();

      const result = await Promise.all(
        hotels.map(async (hotel) => {
          const presignedImages = await Promise.all(
            hotel.images.map((url) => {
              if (url.startsWith("https://cf.bstatic.com/xdata")) {
                return url;
              } else {
                return this.minioService.getPresignedUrl("hotel_image/" + url);
              }
            })
          );

          return {
            id: hotel.id,
            name: hotel.name,
            star: hotel.star,
            address: hotel.address,
            images: presignedImages,
            averageRating: hotel.averagerating ?? 0,
            totalReviews: Number(hotel.totalreviews) || 0,
            minRoomPrice: hotel.minroomprice
          };
        }),
      );

      return {
        status_code: HttpStatus.OK,
        message: 'Top 10 hotels fetched successfully',
        data: result
      };
    } catch (error) {
      console.error('Error fetching top-rated hotels:', error);

      throw new HttpException(
        {
          status_code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Internal server error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // SEARCH - SEARCH HOTEL 
  async findAvailableHotels(searchHotelDto: SearchHotelDto) {
    const { city, checkInDate, checkOutDate, roomType2, roomType4, minRating, minStar, minPrice, maxPrice, page, per_page } = searchHotelDto;
    // console.log('DTO: ', searchHotelDto);

    try {
      const hotelQueryBuilder = this.hotelRepository
        .createQueryBuilder('hotel')
        .leftJoinAndSelect('hotel.locations', 'location')
        .leftJoin('hotel.images', 'image')
        .leftJoin('hotel.reviews', 'review')
        .leftJoin('hotel.roomTypes', 'roomType')
        .leftJoin('roomType.rooms', 'room')
        .leftJoin('hotel.bookings', 'booking', 'booking.status = :status', { status: 'confirmed' })
        .leftJoin('booking.bookingDetails', 'bookingDetail')
        .select([
          'hotel.id AS id',
          'hotel.name AS name',
          'hotel.star AS star',
          'location.city AS city',
          'location.detailAddress AS address',
          'MIN(roomType.price) AS minPrice',
          'ARRAY_AGG(image.url) AS images',
          'AVG(review.rating) AS averageRating',
          'COUNT(review.id) AS totalReviews',
          `COUNT(CASE WHEN room.type = 2 AND (room.status = 'available' OR NOT EXISTS (
              SELECT 1
              FROM booking b
              JOIN booking_detail bd ON b.id = bd."bookingId"
              WHERE b."hotelId" = hotel.id
              AND bd.type = 2
              AND (b."checkinTime" < :checkOutDate AND b."checkoutTime" > :checkInDate)
            )) THEN 1 END) AS roomType2Count`,
          `COUNT(CASE WHEN room.type = 4 AND (room.status = 'available' OR NOT EXISTS (
              SELECT 1
              FROM booking b
              JOIN booking_detail bd ON b.id = bd."bookingId"
              WHERE b."hotelId" = hotel.id
              AND bd.type = 4
              AND (b."checkinTime" < :checkOutDate AND b."checkoutTime" > :checkInDate)
            )) THEN 1 END) AS roomType4Count`
        ])
        .groupBy('hotel.id')
        .addGroupBy('location.id')
        .setParameters({ checkInDate, checkOutDate, city });

      // Các điều kiện tìm kiếm
      if (city) {
        hotelQueryBuilder.andWhere('location.city = :city', { city });
      }
      if (roomType2) {
        hotelQueryBuilder.andHaving('roomType2Count >= :roomType2', { roomType2 });
      }
      if (roomType4) {
        hotelQueryBuilder.andHaving('roomType4Count >= :roomType4', { roomType4 });
      }

      // Lọc 
      // Lọc theo số sao của khách sạn
      if (minStar) {
        hotelQueryBuilder.andWhere('hotel.star >= :minStar', { minStar });
      }
      // Lọc theo đánh giá trung bình tối thiểu
      if (minRating) {
        hotelQueryBuilder.having('AVG(review.rating) >= :minRating', { minRating });
      }
      // Lọc theo giá thấp nhất và lớn nhất
      if (minPrice) {
        hotelQueryBuilder.having('MIN(roomType.price) >= :minPrice', { minPrice });
      }
      if (maxPrice) {
        hotelQueryBuilder.having('MIN(roomType.price) <= :maxPrice', { maxPrice });
      }

      const offset = (page - 1) * per_page;
      const [hotels, totalHotels] = await Promise.all([
        hotelQueryBuilder
          .skip(offset)
          .take(per_page)
          .getRawMany(),
        hotelQueryBuilder.getCount()
      ]);
      const totalPages = Math.ceil(totalHotels / per_page);

      const data = await Promise.all(
        hotels.map(async (hotel) => {
          const presignedImages = await Promise.all(
            hotel.images.map((url) => {
              if (url.startsWith("https://cf.bstatic.com/xdata")) {
                return url;
              } else {
                return this.minioService.getPresignedUrl("hotel_image/" + url);
              }
            })
          );

          return {
            id: hotel.id,
            name: hotel.name,
            star: hotel.star,
            address: hotel.address,
            images: presignedImages,
            averageRating: hotel.averagerating ?? 0,
            totalReviews: Number(hotel.totalreviews) || 0,
            minRoomPrice: hotel.minprice ?? 0,
            numberOfRoom2: Number(hotel.roomtype2count),
            numberOfRoom4: Number(hotel.roomtype4count)
          };
        })
      );

      return {
        status_code: HttpStatus.OK,
        page,
        per_page,
        total: totalHotels,
        total_pages: totalPages,
        data
      };
    } catch (error) {
      console.error('Error finding available hotels:', error);

      throw new HttpException(
        {
          status_code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Internal server error. Please try again later.',
          error: error.message || 'Unknown error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // DETAIL - DETAIL HOTEL
  async findOne(id: number, detailHotelDto: DetailHotelDto) {
    const { checkInDate, checkOutDate, roomType2, roomType4 } = detailHotelDto;
    try {
      // console.log(`Finding hotel with ID: ${id}`);
      const hotel = await this.hotelRepository
        .createQueryBuilder('hotel')
        .leftJoin('hotel.locations', 'location')
        .leftJoin('hotel.images', 'image')
        .leftJoin('hotel.roomTypes', 'roomType')
        .leftJoin('roomType.rooms', 'room')
        .leftJoin('hotel.bookings', 'booking', 'booking.status = :status', { status: 'confirmed' })
        .leftJoin('booking.bookingDetails', 'bookingDetail')
        .select([
          'hotel.id AS id',
          'hotel.name AS name',
          'hotel.star AS star',
          'hotel.description AS description',
          'location.detailAddress AS address',
          'ARRAY_AGG(image.url) AS images',
          `COUNT(CASE WHEN room.type = 2 AND (room.status = 'available' OR NOT EXISTS (
            SELECT 1
            FROM booking b
            JOIN booking_detail bd ON b.id = bd."bookingId"
            WHERE b."hotelId" = hotel.id
            AND bd.type = 2
            AND (b."checkinTime" < :checkOutDate AND b."checkoutTime" > :checkInDate)
          )) THEN 1 END) AS roomType2Count`,
          `COUNT(CASE WHEN room.type = 4 AND (room.status = 'available' OR NOT EXISTS (
            SELECT 1
            FROM booking b
            JOIN booking_detail bd ON b.id = bd."bookingId"
            WHERE b."hotelId" = hotel.id
            AND bd.type = 4
            AND (b."checkinTime" < :checkOutDate AND b."checkoutTime" > :checkInDate)
          )) THEN 1 END) AS roomType4Count`
        ])
        .where('hotel.id = :id', { id })
        .groupBy('hotel.id')
        .addGroupBy('location.id')
        .setParameters({ checkInDate, checkOutDate })
        .getRawOne();

      // Bắt lỗi không tìm thấy khách sạn
      if (!hotel) {
        throw new NotFoundException('Hotel Not Found')
      }

      // Xử lý link hình ảnh Hotel
      const presignedImages = await Promise.all(
        hotel.images.map((url) => {
          if (url.startsWith("https://cf.bstatic.com/xdata")) {
            return url;
          } else {
            return this.minioService.getPresignedUrl("hotel_image/" + url);
          }
        })
      );

      // Lấy ra loại phòng (Giá và số lượng)
      let roomTypes = [];
      try {
        roomTypes = await this.roomTypeRepository
          .createQueryBuilder('room_type')
          .leftJoinAndSelect('room_type.rooms', 'room')
          .select([
            'room_type.id AS id',
            'room_type.type AS type',
            'room_type.price AS price',
            'room_type.weekend_price AS weekend_price',
            'room_type.flexible_price AS flexible_price',
          ])
          .where('room.hotelId = :hotelId', { hotelId: id })
          .groupBy('room_type.id, room_type.type, room_type.price, room_type.weekend_price, room_type.flexible_price')
          .getRawMany();
      } catch (error) {
        console.error('Error fetching rooms:', error);
        throw new Error('Internal server error');
      }

      // Lấy ra review của khách sạn
      // let reviews = [];
      // try {
      //   reviews = await this.hotelRepository
      //     .createQueryBuilder('hotel')
      //     .leftJoin('hotel.reviews', 'review')
      //     .leftJoin('review.user', 'user')
      //     .select([
      //       'review.id AS review_id',
      //       'user.avatar AS review_ava',
      //       'user.name AS review_user',
      //       'review.rating AS review_rate',
      //       'review.comment AS review_cmt',
      //       'review.createdAt AS review_date'
      //     ])
      //     .where('hotel.id = :hotelId', { hotelId: id })
      //     .getRawMany();

      //   // Xử lý hình ảnh avatar người review
      //   for (const review of reviews) {
      //     if (review.review_ava) {
      //       if (review.review_ava.startsWith("https://img.freepik.com")) {
      //         continue;
      //       } else {
      //         review.review_ava = await this.minioService.getPresignedUrl('user_avatar/' + review.review_ava);
      //       }
      //     }
      //   }
      // } catch (error) {
      //   console.error('Error fetching rooms:', error);
      //   throw new Error('Internal server error');
      // }

      return {
        status_code: 200,
        message: 'Hotel details retrieved successfully',
        data: {
          id: hotel.id,
          name: hotel.name,
          description: hotel.description,
          star: hotel.star,
          address: hotel.address,
          city: hotel.city,
          images: presignedImages,
          checkInDate: checkInDate,
          checkOutDate: checkOutDate,
          roomType2: roomType2,
          roomType4: roomType4,
          numberOfRoom2: Number(hotel.roomtype2count),
          numberOfRoom4: Number(hotel.roomtype4count),
          room_types: roomTypes.map(room => ({
            id: room.id,
            type: room.type,
            price: room.price,
            weekend_price: room.weekend_price,
            flexible_price: room.flexible_price
          }))
          // reviews: reviews.map(review => ({
          //   id: review.review_id,
          //   avatar: review.review_ava,
          //   user: review.review_user,
          //   rate: review.review_rate,
          //   date: review.review_date,
          //   comment: review.review_cmt
          // }))
        }
      };
    } catch (error) {
      console.error('Error in findOne method:', error);
      throw new HttpException(
        {
          status_code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Internal server error. Please try again later.',
          error: error.message || 'Unknown error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
