import { TypeOrmModule } from "@nestjs/typeorm";
import { BookingRoom } from "./entities/booking_room.entity";
import { Module } from "@nestjs/common";

@Module({
  imports: [TypeOrmModule.forFeature([BookingRoom])],
})
export class BookingRoomModule {}