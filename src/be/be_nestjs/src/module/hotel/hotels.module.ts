import { Module } from '@nestjs/common';
import { HotelsService } from './hotels.service';
import { HotelsController } from './hotels.controller';
import { Hotel } from './entities/hotel.entity';
import { Room } from '../room/entities/room.entity'
import { RoomsModule } from '../room/rooms.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MinioService } from '@/minio/minio.service';

@Module({
  imports: [TypeOrmModule.forFeature([Hotel, Room]),
    RoomsModule
  ],
  controllers: [HotelsController],
  providers: [HotelsService, MinioService],
})
export class HotelsModule {}
