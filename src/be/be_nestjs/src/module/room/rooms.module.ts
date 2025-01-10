import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { Room } from './entities/room.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomTypeModule } from '../room_type/room_type.module';

@Module({
  imports: [TypeOrmModule.forFeature([Room]), RoomTypeModule],
  controllers: [RoomsController],
  providers: [RoomsService],
})
export class RoomsModule {}
