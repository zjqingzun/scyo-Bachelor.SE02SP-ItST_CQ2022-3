import { Injectable } from '@nestjs/common';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Hotel } from './entities/hotel.entity';
import { Room } from '../room/entities/room.entity';
import { Review } from '../review/entities/review.entity';
import { MinioService } from '@/minio/minio.service';

import { NotFoundException } from '@nestjs/common';
import { SearchHotelDto } from './dto/search-hotel.dto';


@Injectable()
export class HotelsService {

  constructor(
    @InjectRepository(Hotel)
    private readonly hotelRepository: Repository<Hotel>,

    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,

    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,

    private readonly minioService: MinioService,
  ) { }

  create(createHotelDto: CreateHotelDto) {
    return 'This action adds a new hotel';
  }

  findAll() {
    return `This action returns all hotels`;
  }

  // HOME - TOP DESTINATION

  // HOME - TOP 10 RATING HOTEL BY REVIEW
  async getTopTenRatingHotel() {
    const queryBuilder = await this.hotelRepository
      .createQueryBuilder('hotel')
      .leftJoinAndSelect('hotel.images', 'image')
      .leftJoinAndSelect('hotel.locations', 'location')
      .leftJoin('hotel.reviews', 'review')
      .leftJoin('hotel.rooms', 'room')
      .select([
        'hotel.id AS id',
        'hotel.name AS name',
        'hotel.star AS star',
        'location.detailAddress AS address',
        'ARRAY_AGG(image.url) AS images',
        'AVG(review.rating) AS averageRating',
        'COUNT(review.id) AS totalReviews',
        'MIN(room.price) AS minRoomPrice',
      ])
      .groupBy('hotel.id')
      .addGroupBy('location.id')
      .orderBy('averageRating', 'DESC')
      .limit(10) // Lấy top 10 khách sạn

    const hotels = await queryBuilder.getRawMany();
    console.log('HOTEL: ', hotels);

    return Promise.all(
      hotels.map(async (hotel) => {
        const presignedImages = await Promise.all(
          hotel.images.map((url) => this.minioService.getPresignedUrl("hotel_image/" + url))
        );
        // console.log(presignedImages);
        return {
          id: hotel.id,
          name: hotel.name,
          star: hotel.star,
          address: hotel.address,
          images: presignedImages,
          averageRating: hotel.averagerating,
          totalReviews: hotel.totalreviews,
          minRoomPrice: hotel.minroomprice
        };
      }),
    );
  }

  // SEARCH - SEARCH RESULT
  async findAvailableHotels(searchHotelDto: SearchHotelDto) {
    const { city, checkInDate, checkOutDate, roomType2, roomType4 } = searchHotelDto;

    // Lấy ra toàn bộ khách sạn 
    const hotelQueryBuilder = this.hotelRepository
      .createQueryBuilder('hotel')
      .leftJoinAndSelect('hotel.locations', 'location')
      .leftJoin('hotel.images', 'image')
      .leftJoin('hotel.rooms', 'room')
      .select([
        'hotel.id AS id',
        'hotel.name AS name',
        'hotel.star AS star',
        'location.city AS city',
        'location.detailAddress AS address',
        'MIN(room.price) AS minPrice', 
        'ARRAY_AGG(image.url) AS images'
      ])
      .groupBy('hotel.id')
      .addGroupBy('location.id');

      // Nếu có city thì duyệt qua city
      if(city){
        hotelQueryBuilder.andWhere('location.city =: city', { city });
      }

      // Nếu có CheckIn và CheckOut date thì duyệt qua
      if(checkInDate && checkOutDate){
        
      }

      return 'Test';
  }

  // DETAIL - DETAIL HOTEL
  async findOne(id: number) {
    try {
      //console.log(`Finding hotel with ID: ${id}`);
      const hotel = await this.hotelRepository
        .createQueryBuilder('hotel')
        .leftJoin('hotel.locations', 'location')
        .leftJoin('hotel.images', 'image')
        .leftJoin('hotel.rooms', 'room')
        .select([
          'hotel.id AS id',
          'hotel.name AS name',
          'hotel.description AS description',
          'hotel.star AS star',
          'location.detailAddress AS address',
          'ARRAY_AGG(image.url) AS images'
        ])
        .where('hotel.id = :id', { id })
        .groupBy('hotel.id')
        .addGroupBy('location.id')
        .getRawOne();

      if (!hotel) {
        throw new NotFoundException('User Not Found')
      }

      const hotelImgUrls = await Promise.all(
        hotel.images.map((imagePath: string) =>
          this.minioService.getPresignedUrl('hotel_image/' + imagePath),
        ),
      );

      // Lấy ra room thuộc khách sạn
      let rooms = [];
      try {
        rooms = await this.roomRepository
          .createQueryBuilder('room')
          .select([
            'room.id AS room_id',
            'room.roomType AS room_type',
            'room.nums AS room_nums',
            'room.price AS room_price',
            'room.status AS room_status'
          ])
          .where('room.hotelId = :hotelId', { hotelId: id })
          .getRawMany();
      } catch (error) {
        console.error('Error fetching rooms:', error);  // Log chi tiết lỗi
        throw new Error('Internal server error');
      }

      // Lấy ra service 

      // Lấy ra review của khách sạn
      let reviews = [];
      try {
        reviews = await this.hotelRepository
          .createQueryBuilder('hotel')
          .leftJoin('hotel.reviews', 'review')
          .leftJoin('review.user', 'user')
          .select([
            'review.id AS review_id',
            'user.avatar AS review_ava',
            'user.name AS review_user',
            'review.rating AS review_rate',
            'review.comment AS review_cmt',
            'review.createdAt AS review_date'
          ])
          .where('hotel.id = :hotelId', { hotelId: id })
          .getRawMany();

        for (const review of reviews) {
          if (review.review_ava) {
            review.review_ava = await this.minioService.getPresignedUrl('user_avatar/' + review.review_ava);
          }
        }
      } catch (error) {
        console.error('Error fetching rooms:', error);  // Log chi tiết lỗi
        throw new Error('Internal server error');
      }

      return {
        id: hotel.id,
        name: hotel.name,
        description: hotel.description,
        star: hotel.star,
        address: hotel.address,
        city: hotel.city,
        images: hotelImgUrls,
        rooms: rooms.map(room => ({
          id: room.room_id,
          type: room.room_type,
          nums: room.room_nums,
          price: room.room_price,
          status: room.room_status
        })),
        reviews: reviews.map(review => ({
          id: review.review_id,
          avatar: review.review_ava,
          user: review.review_user,
          rate: review.review_rate,
          date: review.review_date,
          comment: review.review_cmt
        }))
      };
    } catch (error) {
      console.error('Error in findOne method:', error);
      throw error;
    }
  }

  update(id: number, updateHotelDto: UpdateHotelDto) {
    return `This action updates a #${id} hotel`;
  }

  remove(id: number) {
    return `This action removes a #${id} hotel`;
  }
}
