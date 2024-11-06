import { Bill } from "@/module/bill/entities/bill.entity";
import { Booking } from "@/module/booking/entities/booking.entity";
import { Hotel } from "@/module/hotel/entities/hotel.entity";
import { Payment } from "@/module/payment/entities/payment.entity";
import { Review } from "@/module/review/entities/review.entity";
import { Role } from "@/module/role/entities/role.entity";
import { Room } from "@/module/room/entities/room.entity";
import moment from "moment";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: "user"})
export class User {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    name: string;

    @Column({type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    dob: Date;

    @Column({default: "000000000000"})
    cccd: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    phone: string;

    @ManyToMany(() => Role, (role) => role.users)
    @JoinTable({
        name: "users_roles"
    })
    roles: Role[];

    @Column({default: "email"})
    accountType: string;

    @Column({default: ""})
    codeId: string;

    @Column({type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    codeExpired: Date;

    @OneToMany(() => Booking, (booking) => booking.user)
    bookings: Booking[];

    @OneToMany(() => Hotel, (hotel) => hotel.owner)
    hotels: Hotel[];

    @ManyToMany(() => Hotel, (hotel) => hotel.userFavourited)
    @JoinTable({
        name: "users_hotels"
    })
    hotelFavourite: Hotel[];

    @OneToMany(() => Review, (review) => review.user)
    reviews: Review[];

    @OneToMany(() => Bill, (bill) => bill.user)
    bills: Bill[];

    @Column()
    avatar: string;
}