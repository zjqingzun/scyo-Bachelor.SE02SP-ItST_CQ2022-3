import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomType } from './entites/room_type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RoomType])],
})
export class RoomTypeModule {}
