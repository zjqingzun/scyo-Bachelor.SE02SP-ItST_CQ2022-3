import { Bill } from "@/module/bill/entities/bill.entity";
import { Booking } from "@/module/booking/entities/booking.entity";
import { BookingDetail } from "@/module/booking_detail/entities/booking_detail.entity";
import { BookingRoom } from "@/module/booking_room/entities/booking_room.entity";
import { Hotel } from "@/module/hotel/entities/hotel.entity";
import { Image } from "@/module/image/entities/image.entity";
import { Location } from "@/module/location/entities/location.entity";
import { Payment } from "@/module/payment/entities/payment.entity";
import { Report } from "@/module/report/entities/report.entity";
import { Review } from "@/module/review/entities/review.entity";
import { Role } from "@/module/role/entities/role.entity";
import { Room } from "@/module/room/entities/room.entity";
import { RoomType } from "@/module/room_type/entites/room_type.entity";
import { Service } from "@/module/service/entities/service.entity";
import { User } from "@/module/user/entities/user.entity";
import { ConfigService } from "@nestjs/config";
import { DataSource } from "typeorm";
// const configService = new ConfigService();
export default new DataSource({
    type: 'postgres',
    host: "88.222.212.40",
    port: 5432,
    username: "bookastaydata",
    password: "bookastaydata",
    database: "bookastay",
    migrations: ["./migrations/**"],
    entities: [User, Bill, Booking, Hotel, Location, Payment, Report, Review, Room, Service, Image, Role, RoomType, BookingDetail, BookingRoom],
});