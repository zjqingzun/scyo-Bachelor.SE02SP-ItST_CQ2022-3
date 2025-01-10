import { Bill } from "@/module/bill/entities/bill.entity";
import { BookingDetail } from "@/module/booking_detail/entities/booking_detail.entity";
import { BookingRoom } from "@/module/booking_room/entities/booking_room.entity";
import { Hotel } from "@/module/hotel/entities/hotel.entity";
import { Payment } from "@/module/payment/entities/payment.entity";
import { Room } from "@/module/room/entities/room.entity";
import { User } from "@/module/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "booking" })
export class Booking {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({
        default: `now()`,
        nullable: true,
    })
    createdAt: Date;

    @CreateDateColumn({
        default: `now()`,
        nullable: true,
    })
    checkinTime: string;

    @CreateDateColumn({
        default: `now()`,
        nullable: true,
    })
    checkoutTime: string;

    @Column()
    status: string;

    @Column()
    note: string;

    @ManyToOne(() => User, (user) => user.bookings)
    @JoinColumn({ name: "userId" })
    user: User;

    @ManyToOne(() => Hotel, (hotel) => hotel.bookings)
    @JoinColumn({ name: "hotelId" })
    hotel: Hotel;

    @OneToOne(() => Bill, (bill) => bill.booking)
    bill: Bill;

    @OneToMany(() => BookingDetail, (bookingDetail) => bookingDetail.booking)
    bookingDetails: BookingDetail[];

    @OneToMany(() => BookingRoom, (bookingRoom) => bookingRoom.booking)
    bookingRooms: BookingRoom[];

    @OneToOne(() => Payment, (payment) => payment.booking)
    payment: Payment;
} 
