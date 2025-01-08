import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

import { Review } from '../review/entities/review.entity';
import { MinioService } from '@/minio/minio.service';
import { GetReviewDto } from './dto/get-review.dto';
import * as moment from 'moment';
import { hours } from '@nestjs/throttler';


@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,

    private readonly minioService: MinioService,
  ) { }

  async create(createReviewDto: CreateReviewDto) {
    const review = {...createReviewDto, createdAt: moment().toLocaleString()};
    const res = await this.reviewRepository
                  .createQueryBuilder()
                  .insert()
                  .into(Review)
                  .values({
                    comment: review.comment,
                    rating: review.rating,
                    createdAt: review.createdAt,
                    userId: review.userId,
                    hotelId: review.hotelId
                  })
                  .execute();
    return {
      status_code: 200,
      message: "Successfully",
      data: res.raw
    };
  }

  async  getReviewById(id: string) {
    try {
      const reviews = await this.reviewRepository
        .createQueryBuilder('review')
        .select()
        .leftJoin('review.user', 'user')
        .select([
          'review.*',
          'user.name',
          'user.avatar'
        ])
        .where({
          id: id
        })
        .execute();
      const review = reviews[0];
      return {
        status_code: 200,
        message: 'Reviews retrieved successfully',
        data: {
            id: review.id,
            avatar: review.user_avatar,
            name: review.user_name,
            rate: review.rating,
            date: review.createdAt,
            comment: review.comment,
        },
      };
    } catch (error) {
      console.error('Error getting reviews:', error);
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

  findAll() {
    return `This action returns all review`;
  }

  findOne(id: number) {
    return `This action returns a #${id} review`;
  }

  update(id: number, updateReviewDto: UpdateReviewDto) {
    return `This action updates a #${id} review`;
  }

  remove(id: number) {
    return `This action removes a #${id} review`;
  }

  async getHotelReviews(id: number, getReviewDto: GetReviewDto) {
    const { page, per_page } = getReviewDto;
    try {
      const offset = (page - 1) * per_page;

      const reviews = await this.reviewRepository
        .createQueryBuilder('review')
        .leftJoin('review.user', 'user')
        .select([
          'review.id AS review_id',
          'user.avatar AS review_ava',
          'user.name AS review_user',
          'review.rating AS review_rate',
          'review.comment AS review_cmt',
          'review."createdAt" AS review_date',
        ])
        .where('review."hotelId" = :hotelId', { hotelId: id })
        .orderBy('review.createdAt', 'DESC')
        .limit(per_page)
        .offset(offset)
        .getRawMany();  

      // Đếm số lượng review
      const totalCount = await this.reviewRepository
        .createQueryBuilder('review')
        .leftJoin('review.user', 'user')
        .where('review."hotelId" = :hotelId', { hotelId: id })
        .getCount();

      // Xử lý link ảnh avatar
      for (const review of reviews) {
        if (review.review_ava && !review.review_ava.startsWith("https://img.freepik.com")) {
          review.review_ava = await this.minioService.getPresignedUrl('user_avatar/' + review.review_ava);
        }
      }

      return {
        status_code: 200,
        message: 'Reviews retrieved successfully',
        page,
        per_page,
        total: totalCount,
        total_pages: Math.ceil(totalCount / per_page),
        data: {
          reviews: reviews.map(review => ({
            id: review.review_id,
            avatar: review.review_ava,
            name: review.review_user,
            rate: review.review_rate,
            date: review.review_date,
            comment: review.review_cmt,
          })),
        },
      };
    } catch (error) {
      console.error('Error fetching reviews:', error);
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
