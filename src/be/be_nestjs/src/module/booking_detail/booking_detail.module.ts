import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingDetail } from './entities/booking_detail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BookingDetail])],
})
export class BookingDetailModule {}
