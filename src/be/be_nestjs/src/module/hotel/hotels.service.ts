import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { Hotel } from './entities/hotel.entity';
import { RoomType } from '../room_type/entites/room_type.entity';
import { Room } from '../room/entities/room.entity';
import { MinioService } from '@/minio/minio.service';

import { NotFoundException } from '@nestjs/common';
import { SearchHotelDto } from './dto/search-hotel.dto';
import { DetailHotelDto } from './dto/detail-hotel.dto';
import { ConfigService } from '@nestjs/config';
import { ImageService } from '../image/image.service';
import { LocationsService } from '../location/locations.service';
import { Location } from '../location/entities/location.entity';
import { RoomTypeService } from '../room_type/room_type.service';

@Injectable()
export class HotelsService {
  constructor(
    private dataSource: DataSource,

    @InjectRepository(Hotel)
    private readonly hotelRepository: Repository<Hotel>,

    private readonly imageService: ImageService,

    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,

    @InjectRepository(RoomType)
    private readonly roomTypeRepository: Repository<RoomType>,

    private readonly minioService: MinioService,
    private readonly locationService: LocationsService,
    private readonly roomtypeService: RoomTypeService,
  ) {}

  create(createHotelDto: CreateHotelDto) {
    return 'This action adds a new hotel';
  }
  async findOneByOwnerId(ownerId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    const res = await queryRunner.manager.query(`
      SELECT h.*, l."detailAddress"
      FROM hotel h
        JOIN hotels_locations hl ON h.id = hl."hotelId"
        JOIN location l ON l.id = hl."locationId"
      WHERE "ownerId" = ${ownerId}
    `);
    queryRunner.release();
    return res[0];
  }

  async findAll(req: {
    query: {
      page?: 1;
      limit?: 10;
      sortBy?: 'id';
      order?: 'ASC';
      searchTerm: any;
    };
  }) {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = 'id',
        order = 'ASC',
        searchTerm,
      } = req.query;
      const queryBuilder = this.hotelRepository
        .createQueryBuilder('hotel')
        .leftJoinAndSelect('hotels_locations', 'hl', 'hl."hotelId" = hotel.id')
        .leftJoinAndSelect('user', 'u', 'u.id = hotel."ownerId"')
        .leftJoinAndSelect('location', 'l', 'l.id = hl."locationId"')
        .select(['hotel.id', 'hotel.name', 'u.name', 'l.city']);

      queryBuilder.orderBy(`hotel.${sortBy}`, order === 'ASC' ? 'ASC' : 'DESC');

      const res = await queryBuilder
        .take(+limit)
        .skip((+page - 1) * +limit)
        .getRawAndEntities();

      const hotels = res.raw.map((entity) => ({
        id: entity.hotel_id,
        name: entity.hotel_name,
        hotelierName: entity.u_name,
        location: entity.l_city,
      }));
      const total = await this.hotelRepository.count();

      return {
        page: page,
        per_page: limit,
        total,
        total_pages: Math.ceil(total / +limit),
        hotels,
      };
    } catch (error) {
      console.error('Error fetching all hotels:', error);
      throw new HttpException(
        {
          status_code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Internal server error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  update(id: number, updateHotelDto: UpdateHotelDto) {
    return `This action updates a #${id} hotel`;
  }

  async remove(id: number) {
    try {
      const result = await this.hotelRepository.delete({ id: id });
      if (result.affected === 0) {
        return { status: 404, message: 'Hotel not found' };
      }
      return { status: 200, message: 'Delete hotel successfully' };
    } catch (error) {
      console.error('Error delete hotels:', error);
      throw new HttpException(
        {
          status_code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Internal server error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // HOME - TOP 10 RATING HOTEL BY REVIEW
  async getTopTenRatingHotel(userId: number) {
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
          'ARRAY_AGG(DISTINCT image.url) AS images',
          'SUM(review.rating) AS totalrating',
          'AVG(CASE WHEN review.rating IS NOT NULL THEN review.rating ELSE NULL END) AS averagerating',
          'COUNT(DISTINCT review.id) AS totalreviews',
          'MIN(roomType.price) AS minroomprice',
        ])
        .where('hotel.status = :status', { status: 'approved' })
        .groupBy('hotel.id')
        .addGroupBy('location.id')
        .orderBy('COALESCE(AVG(review.rating), 0)', 'DESC')
        .limit(10);

      const hotels = await queryBuilder.getRawMany();

      const result = await Promise.all(
        hotels.map(async (hotel) => {
          let isFav = false;
          if (userId) {
            const queryRunner = this.dataSource.createQueryRunner();
            const res = await queryRunner.query(`
              SELECT *
              FROM "user_favouriteHotel" where "hotelId" = ${hotel.id} AND "userId" = ${userId}
            `);
            if (res.length > 0) {
              console.log('>>> res: ', res);
              isFav = true;
            }
            await queryRunner.release();
          }
          const presignedImages = await Promise.all(
            hotel.images.map((url: string) => {
              if (
                url.startsWith('https://cf.bstatic.com/xdata') ||
                url.startsWith('http://88.222.212.40')
              ) {
                return url;
              } else {
                return this.minioService.getPresignedUrl('hotel_image/' + url);
              }
            }),
          );

          return {
            id: hotel.id,
            isFav,
            name: hotel.name,
            star: hotel.star,
            address: hotel.address,
            images: presignedImages,
            averageRating: hotel.averagerating,
            totalReviews: Number(hotel.totalreviews) || 0,
            minRoomPrice: hotel.minroomprice,
          };
        }),
      );

      return {
        status_code: HttpStatus.OK,
        message: 'Top 10 hotels fetched successfully',
        data: result,
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
  async findAvailableHotels(searchHotelDto: SearchHotelDto, userId: number) {
    const {
      city,
      checkInDate,
      checkOutDate,
      roomType2,
      roomType4,
      minRating,
      minStar,
      minPrice,
      maxPrice,
      page,
      per_page,
    } = searchHotelDto;
    // console.log('DTO: ', searchHotelDto);

    try {
      const queryBuilder = await this.hotelRepository
        .createQueryBuilder('hotel')
        .leftJoinAndSelect('hotel.images', 'image')
        .leftJoinAndSelect('hotel.locations', 'location')
        .leftJoin('hotel.reviews', 'review')
        .leftJoin('hotel.roomTypes', 'roomType')
        .leftJoin('roomType.rooms', 'room') // Join thông qua bảng roomType
        .leftJoin('hotel.bookings', 'booking')
        .leftJoin('booking.bookingDetails', 'bookingdetail')
        .select([
          'hotel.id AS id',
          'hotel.name AS name',
          'hotel.star AS star',
          'location.city AS city',
          'location.detailAddress AS address',
          'ARRAY_AGG(DISTINCT image.url) AS images',
          'SUM(review.rating) AS totalrating',
          'AVG(CASE WHEN review.rating IS NOT NULL THEN review.rating ELSE NULL END) AS averagerating',
          'COUNT(DISTINCT review.id) AS totalreviews',
          'MIN(roomType.price) AS minroomprice',
          `COUNT(DISTINCT CASE WHEN room.type = 2 AND (room.status = 'available' OR NOT EXISTS (
            SELECT 1
            FROM booking b
            JOIN booking_detail bd ON b.id = bd."bookingId"
            WHERE b."hotelId" = hotel.id
            AND bd.type = 2
            AND (b."checkinTime" < :checkOutDate AND b."checkoutTime" > :checkInDate)
          )) THEN room.id END) AS numberoftype2`,
          `COUNT(DISTINCT CASE WHEN room.type = 4 AND (room.status = 'available' OR NOT EXISTS (
            SELECT 1
            FROM booking b
            JOIN booking_detail bd ON b.id = bd."bookingId"
            WHERE b."hotelId" = hotel.id
            AND bd.type = 4
            AND (b."checkinTime" < :checkOutDate AND b."checkoutTime" > :checkInDate)
          )) THEN room.id END) AS numberoftype4`,
        ])
        .where('hotel.status = :status', { status: 'approved' })
        .groupBy('hotel.id')
        .addGroupBy('location.id')
        .setParameters({ checkInDate, checkOutDate });

      // Test trả về
      // "ARRAY_AGG(DISTINCT CASE WHEN room.status = 'available' THEN jsonb_build_object('id', room.id, 'name', room.name, 'type', room.type, 'hotelId', room.hotelId) END) AS availablerooms"

      // Nếu có city thì duyệt qua city
      if (city) {
        const normalizedCity = removeDiacritics(city);
        queryBuilder.andWhere('LOWER(UNACCENT(location.city)) = :city', {
          city: normalizedCity,
        });
      }

      if (roomType2) {
        queryBuilder.andWhere(
          (subQuery) => {
            const sub = subQuery
              .subQuery()
              .select('COUNT(DISTINCT room.id)')
              .from('Room', 'room')
              .leftJoin('room.roomType', 'roomType')
              .where('roomType.hotelId = hotel.id')
              .andWhere('room.type = 2')
              .andWhere(
                `(room.status = 'available' OR NOT EXISTS (
              SELECT 1
              FROM booking b
              JOIN booking_detail bd ON b.id = bd."bookingId"
              WHERE b."hotelId" = hotel.id
              AND bd.type = 2
              AND (b."checkinTime" < :checkOutDate AND b."checkoutTime" > :checkInDate)
            ))`,
              )
              .getQuery();

            return `(${sub}) >= :roomType2`;
          },
          { roomType2 },
        );
      }

      if (roomType4) {
        queryBuilder.andWhere(
          (subQuery) => {
            const sub = subQuery
              .subQuery()
              .select('COUNT(DISTINCT room.id)')
              .from('Room', 'room')
              .leftJoin('room.roomType', 'roomType')
              .where('roomType.hotelId = hotel.id')
              .andWhere('room.type = 4')
              .andWhere(
                `(room.status = 'available' OR NOT EXISTS (
              SELECT 1
              FROM booking b
              JOIN booking_detail bd ON b.id = bd."bookingId"
              WHERE b."hotelId" = hotel.id
              AND bd.type = 4
              AND (b."checkinTime" < :checkOutDate AND b."checkoutTime" > :checkInDate)
            ))`,
              )
              .getQuery();

            return `(${sub}) >= :roomType4`;
          },
          { roomType4 },
        );
      }

      // Lọc
      // Lọc theo số sao của khách sạn
      // if (minStar) {
      //   queryBuilder.andWhere('hotel.star >= :minStar', { minStar });
      // }
      if (minStar && minStar.length > 0) {
        queryBuilder.andWhere('hotel.star IN (:...minStar)', { minStar });
      }
      // Lọc theo đánh giá trung bình tối thiểu
      if (minRating) {
        queryBuilder.having('AVG(review.rating) >= :minRating', { minRating });
      }
      // Lọc theo giá thấp nhất và lớn nhất
      if (minPrice && maxPrice) {
        queryBuilder.having(
          'MIN(roomType.price) >= :minPrice AND MIN(roomType.price) <= :maxPrice',
          { minPrice, maxPrice },
        );
      } else if (minPrice) {
        queryBuilder.having('MIN(roomType.price) >= :minPrice', { minPrice });
      } else if (maxPrice) {
        queryBuilder.having('MIN(roomType.price) <= :maxPrice', { maxPrice });
      }

      const offset = (page - 1) * per_page;

      // Áp dụng skip và take trước khi lấy kết quả
      queryBuilder.limit(per_page).offset(offset);
      const [hotels, totalHotels] = await Promise.all([
        queryBuilder.getRawMany(),
        queryBuilder.getCount(),
      ]);
      const totalPages = Math.ceil(totalHotels / per_page);

      console.log({
        page,
        per_page,
        offset,
        hotels: hotels.length,
        totalHotels,
      });

      // Xử lý hình ảnh và trả kết quả về
      // const hotels = await queryBuilder.getRawMany();
      const result = await Promise.all(
        hotels.map(async (hotel) => {
          let isFav = false;
          if (userId) {
            const queryRunner = this.dataSource.createQueryRunner();
            const res = await queryRunner.query(`
              SELECT *
              FROM "user_favouriteHotel" where "hotelId" = ${hotel.id} AND "userId" = ${userId}
            `);
            if (res.length > 0) {
              isFav = true;
            }
            await queryRunner.release();
          }
          const presignedImages = await Promise.all(
            hotel.images.map((url: string) => {
              if (
                url.startsWith('https://cf.bstatic.com/xdata') ||
                url.startsWith('http://88.222.212.40')
              ) {
                return url;
              } else {
                return this.minioService.getPresignedUrl('hotel_image/' + url);
              }
            }),
          );

          return {
            id: hotel.id,
            isFav,
            name: hotel.name,
            star: hotel.star,
            address: hotel.address,
            images: presignedImages,
            averageRating: hotel.averagerating,
            totalReviews: Number(hotel.totalreviews) || 0,
            minRoomPrice: hotel.minroomprice,
            numberOfType2: Number(hotel.numberoftype2) || 0,
            numberOfType4: Number(hotel.numberoftype4) || 0,
          };
        }),
      );

      return {
        status_code: HttpStatus.OK,
        message: 'Search successfully',
        page,
        per_page,
        total: totalHotels,
        total_pages: totalPages,
        data: result,
      };
    } catch (error) {
      console.error('Error searching hotels:', error);

      throw new HttpException(
        {
          status_code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Internal server error',
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
        .leftJoinAndSelect('hotel.images', 'image')
        .leftJoinAndSelect('hotel.locations', 'location')
        .leftJoin('hotel.reviews', 'review')
        .leftJoin('hotel.roomTypes', 'roomType')
        .leftJoin('roomType.rooms', 'room') // Join thông qua bảng roomType
        .leftJoin('hotel.bookings', 'booking')
        .leftJoin('booking.bookingDetails', 'bookingdetail')
        .select([
          'hotel.id AS id',
          'hotel.name AS name',
          'hotel.star AS star',
          'hotel.description AS description',
          'location.detailAddress AS address',
          'ARRAY_AGG(DISTINCT image.url) AS images',
          'SUM(review.rating) AS totalrating',
          'AVG(CASE WHEN review.rating IS NOT NULL THEN review.rating ELSE NULL END) AS averagerating',
          'COUNT(DISTINCT review.id) AS totalreviews',
          'MIN(roomType.price) AS minroomprice',
          `COUNT(DISTINCT CASE WHEN room.type = 2 AND (room.status = 'available' OR NOT EXISTS (
            SELECT 1
            FROM booking b
            JOIN booking_detail bd ON b.id = bd."bookingId"
            WHERE b."hotelId" = hotel.id
            AND bd.type = 2
            AND (b."checkinTime" < :checkOutDate AND b."checkoutTime" > :checkInDate)
          )) THEN room.id END) AS numberoftype2`,
          `COUNT(DISTINCT CASE WHEN room.type = 4 AND (room.status = 'available' OR NOT EXISTS (
            SELECT 1
            FROM booking b
            JOIN booking_detail bd ON b.id = bd."bookingId"
            WHERE b."hotelId" = hotel.id
            AND bd.type = 4
            AND (b."checkinTime" < :checkOutDate AND b."checkoutTime" > :checkInDate)
          )) THEN room.id END) AS numberoftype4`,
        ])
        .where('hotel.id = :id', { id })
        .groupBy('hotel.id')
        .addGroupBy('location.id')
        .setParameters({ checkInDate, checkOutDate })
        .getRawOne();

      // Bắt lỗi không tìm thấy khách sạn
      if (!hotel) {
        throw new NotFoundException('Hotel Not Found');
      }

      // Xử lý link hình ảnh Hotel
      const presignedImages = await Promise.all(
        hotel.images.map((url: string) => {
          if (url.startsWith('https://cf.bstatic.com/xdata')) {
            return url;
          } else {
            return this.minioService.getPresignedUrl('hotel_image/' + url);
          }
        }),
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
          .groupBy(
            'room_type.id, room_type.type, room_type.price, room_type.weekend_price, room_type.flexible_price',
          )
          .getRawMany();
      } catch (error) {
        console.error('Error fetching rooms:', error);
        throw new Error('Internal server error');
      }

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
          numberOfRoom2: Number(hotel.numberoftype2),
          numberOfRoom4: Number(hotel.numberoftype4),
          room_types: roomTypes.map((room) => ({
            id: room.id,
            type: room.type,
            price: room.price,
            weekend_price: room.weekend_price,
            flexible_price: room.flexible_price,
          })),
        },
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

  async totalRequest() {
    const total = await this.hotelRepository
      .createQueryBuilder('hotel')
      .where('hotel.status = :status', { status: 'pending' })
      .getCount();
    return {
      status: 200,
      total: total,
    };
  }

  async getRequest() {
    return this.hotelRepository
      .createQueryBuilder('hotel')
      .leftJoinAndSelect('hotels_locations', 'hl', 'hotel.id = hl.hotelId')
      .leftJoinAndSelect('location', 'location', 'location.id = hl.locationId')
      .select([
        'hotel.id',
        'hotel.email',
        'hotel.name',
        'hotel.createdat',
        'hotel.status',
        'location.detailAddress',
      ])
      .where('hotel.status = :status', { status: 'pending' })
      .orderBy('hotel.id', 'ASC')
      .getRawMany();
  }

  async addBasicInfo(createHotelDto: CreateHotelDto, userId: string) {
    const hotel = { ...createHotelDto, ownerId: userId, discount: 0 };
    const location = {
      name: hotel.ward,
      district: hotel.district,
      city: hotel.city,
      detailAddress: hotel.detailAddress,
    };
    try {
      const queryBuilder = await this.hotelRepository
        .createQueryBuilder()
        .insert()
        .into('hotel')
        .values({
          name: hotel.name,
          description: hotel.description,
          discount: hotel.discount,
          owner: { id: hotel.ownerId },
          phone: hotel.phone,
          email: hotel.email,
          star: hotel.star,
        })
        .execute();

      const hotelId = queryBuilder.raw[0].id;
      const locationId = await (
        await this.locationService.add(location)
      ).raw[0].id;

      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.manager.query(`
        INSERT INTO hotels_locations("hotelId", "locationId")
        VALUES (${hotelId}, ${locationId})  
      `);

      queryRunner.release();

      return {
        status: 200,
        message: 'Successfully',
        hotel: hotelId,
      };
    } catch (error) {
      console.error('Error when add basic info for hotel:', error);
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

  async uploadImages(images: Express.Multer.File[], hotelId: string) {
    try {
      const hotel = await this.hotelRepository.findOneBy({ id: +hotelId });
      if (!hotel) {
        throw new BadRequestException('Hotel does not exist');
      }
      const res = await this.imageService.uploadHotelImages(images, hotel);
      return {
        status: 200,
        message: 'Successfully',
        images: res,
      };
    } catch (error) {
      console.error('Error when upload hotel images:', error);
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

  async addPaymentMethod(hotelId: string, body: any) {
    try {
      const queryBuilder = await this.hotelRepository
        .createQueryBuilder()
        .update()
        .set({
          onlineMethod: body.paymentAccount ? true : false,
          paymentAccount: body.paymentAccount ? body.paymentAccount : '',
        })
        .where({ id: +hotelId })
        .execute();

      return {
        status: 200,
        mesasge: 'Successfully',
      };
    } catch (error) {
      console.error('Error when set payment for hotel:', error);
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

  async updateHotelStatus(hotelId: number, status: string) {
    try {
      const queryRunner = this.dataSource.createQueryRunner();
      const res = await queryRunner.manager.query(`
        UPDATE hotel
        SET status = $1
        WHERE id = $2  
      `, [status, hotelId]);
      return {
        status: 200,
        message: "Successfully"
      };
    } catch (error) {
      console.error('Error update status for hotel:', error);
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

function removeDiacritics(value: string): string {
  return value
    .normalize('NFD') // Chuẩn hóa ký tự Unicode
    .replace(/[\u0300-\u036f]/g, '') // Loại bỏ dấu
    .toLowerCase(); // Chuyển thành chữ thường
}