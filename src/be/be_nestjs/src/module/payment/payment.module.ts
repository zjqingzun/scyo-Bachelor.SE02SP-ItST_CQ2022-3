import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { MinioService } from '@/minio/minio.service';
import { Booking } from '../booking/entities/booking.entity';
import { Hotel } from '../hotel/entities/hotel.entity';
import { RoomType } from '../room_type/entites/room_type.entity';
import { Room } from '../room/entities/room.entity';
import { User } from '../user/entities/user.entity';
import { BookingDetail } from '../booking_detail/entities/booking_detail.entity';
import { BookingRoom } from '../booking_room/entities/booking_room.entity';
import { BookingModule } from '../booking/booking.module';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, Booking, Hotel, RoomType, Room, User, BookingDetail, BookingRoom]), BookingModule],
  controllers: [PaymentController],
  providers: [PaymentService, MinioService],
})
export class PaymentModule {}
