import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

import { Request, Response } from 'express';
import { Booking } from '../booking/entities/booking.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BookingDetail } from '../booking_detail/entities/booking_detail.entity';
import { Repository } from 'typeorm';
import { BookingRoom } from '../booking_room/entities/booking_room.entity';
import { Payment } from './entities/payment.entity';
import { RoomType } from '../room_type/entites/room_type.entity';
import { MinioService } from '@/minio/minio.service';
import { User } from '../user/entities/user.entity';
import { Room } from '../room/entities/room.entity';
import { Hotel } from '../hotel/entities/hotel.entity';

@Injectable()
export class PaymentService {

  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,

    @InjectRepository(BookingDetail)
    private readonly bookingDetailRepository: Repository<BookingDetail>,

    @InjectRepository(BookingRoom)
    private readonly bookingRoomRepository: Repository<BookingRoom>,

    @InjectRepository(Hotel)
    private readonly hotelRepository: Repository<Hotel>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,

    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,

    @InjectRepository(RoomType)
    private readonly roomTypeRepository: Repository<RoomType>,

    private readonly minioService: MinioService,
  ) { }

  async deleteCookie(res: Response){
    res.clearCookie('bookingData');
    res.status(200).send('Cookie "bookingData" đã được xóa!');
  }


  create(createPaymentDto: CreatePaymentDto) {
    return 'This action adds a new payment';
  }

  findAll() {
    return `This action returns all payment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
