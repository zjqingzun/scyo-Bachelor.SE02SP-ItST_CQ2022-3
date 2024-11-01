import { Bill } from "@/module/bill/entities/bill.entity";
import { Booking } from "@/module/booking/entities/booking.entity";
import { Hotel } from "@/module/hotel/entities/hotel.entity";
import { Location } from "@/module/location/entities/location.entity";
import { Payment } from "@/module/payment/entities/payment.entity";
import { Report } from "@/module/report/entities/report.entity";
import { Review } from "@/module/review/entities/review.entity";
import { Room } from "@/module/room/entities/room.entity";
import { Service } from "@/module/service/entities/service.entity";
import { User } from "@/module/users/entities/user.entity";
import { ConfigService } from "@nestjs/config";
import { DataSource } from "typeorm";

const configService = new ConfigService();

export default new DataSource({
    type: 'postgres',
    host: configService.get<string>('DATABASE_HOST'),
    port: configService.get<number>('DATABASE_PORT'),
    username: configService.get<string>('DATABASE_USERNAME'),
    password: configService.get<string>('DATABASE_PASSWORD'),
    database: configService.get<string>('DATABASE_NAME'),
    migrations: ["migrations/**"],
    entities: [User, Bill, Booking, Hotel, Location, Payment, Report, Review, Room, Service],
});