import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomType } from './entites/room_type.entity';
import { RoomTypeService } from './room_type.service';
import { RoomTypeController } from './room_type.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RoomType])],
  controllers: [RoomTypeController],
  providers: [RoomTypeService],
  exports: [RoomTypeService]
})
export class RoomTypeModule {}
