import { Booking } from "@/module/booking/entities/booking.entity";
import { BookingDetail } from "@/module/booking_detail/entities/booking_detail.entity";
import { Image } from "@/module/image/entities/image.entity";
import { Location } from "@/module/location/entities/location.entity";
import { Report } from "@/module/report/entities/report.entity";
import { Review } from "@/module/review/entities/review.entity";
import { Room } from "@/module/room/entities/room.entity";
import { RoomType } from "@/module/room_type/entites/room_type.entity";
import { User } from "@/module/user/entities/user.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "hotel" })
export class Hotel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    discount: number;

    @Column()
    phone: number;

    @Column()
    email: string;

    @Column()
    star: number;

    @Column({default: 'pending'})
    status: string;

    @Column({default: false})
    onlineMethod: boolean;

    @Column({default: ''})
    paymentAccount: string;

    @ManyToOne(() => User, (user) => user.hotels)
    @JoinColumn({ name: "ownerId" })
    owner: User;

    @ManyToMany(() => User, (user) => user.hotelFavourite)
    userFavourited: User[];

    @OneToMany(() => Review, (review) => review.hotel)
    reviews: Review[];

    @ManyToMany(() => Location, (location) => location.hotels)
    @JoinTable({
        name: "hotels_locations"
    })
    locations: Location[];

    @OneToMany(() => Report, (report) => report.hotel)
    reports: Report[];

    @OneToMany(() => Image, (image) => image.hotel)
    images: Image[];

    @OneToMany(() => RoomType, (roomType) => roomType.hotel)
    roomTypes: RoomType[];

    @OneToMany(() => Room, (room) => room.hotel)
    rooms: Room[];

    @OneToMany(() => Booking, (booking) => booking.hotel)
    bookings: Booking[];
}
