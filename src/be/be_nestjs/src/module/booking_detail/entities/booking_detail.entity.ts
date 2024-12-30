import { Booking } from "@/module/booking/entities/booking.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: "booking_detail"})
export class BookingDetail {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    type: string;

    @Column()
    nums: number;

    @Column()
    price: number;

    @OneToOne(() => Booking, (booking) => booking.detail)
    @JoinColumn({name: "bookingId"})
    booking: Booking;
}