import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { MinioService } from '@/minio/minio.service';
import { Hotel } from '../hotel/entities/hotel.entity';
import { RoomType } from '../room_type/entites/room_type.entity';
import { Room } from '../room/entities/room.entity';
import { User } from '../user/entities/user.entity';
import { BookingDetail } from '../booking_detail/entities/booking_detail.entity';
import { BookingRoom } from '../booking_room/entities/booking_room.entity';
import { Payment } from '../payment/entities/payment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, Hotel, RoomType, Room, User, BookingDetail, BookingRoom, Payment])],
  controllers: [BookingController],
  providers: [BookingService, MinioService],
  exports: [BookingService]
})
export class BookingModule {}
