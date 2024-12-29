import { Module } from '@nestjs/common';
import { Hotel } from './entities/hotel.entity';
import { HotelsService } from './hotels.service';
import { HotelsController } from './hotels.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MinioService } from '@/minio/minio.service';


import { Room } from '../room/entities/room.entity'
import { RoomsModule } from '../room/rooms.module';
import { Review } from '../review/entities/review.entity';
import { ReviewModule } from '../review/review.module';

@Module({
  imports: [TypeOrmModule.forFeature([Hotel, Room, Review]),
    RoomsModule,
    ReviewModule
  ],
  controllers: [HotelsController],
  providers: [HotelsService, MinioService],
})
export class HotelsModule {}
