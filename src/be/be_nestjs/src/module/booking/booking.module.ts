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

@Module({
  imports: [TypeOrmModule.forFeature([Booking, Hotel, RoomType, Room, User])],
  controllers: [BookingController],
  providers: [BookingService, MinioService],
})
export class BookingModule {}
