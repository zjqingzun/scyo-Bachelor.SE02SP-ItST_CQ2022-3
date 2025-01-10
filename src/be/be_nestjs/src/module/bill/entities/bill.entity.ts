import { Booking } from "@/module/booking/entities/booking.entity";
import { Payment } from "@/module/payment/entities/payment.entity";
import { User } from "@/module/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: "bill"})
export class Bill {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    numOfDay: number;

    @Column({type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column()
    totalCost: number;

    @OneToOne(() => Booking, (booking) => booking.bill)
    @JoinColumn({name: "bookingId"})
    booking: Booking;

    @ManyToOne(() => User, (user) => user.bills)
    @JoinColumn({name: "userId"})
    user: User;
}
