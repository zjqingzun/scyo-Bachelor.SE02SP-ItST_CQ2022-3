import { Bill } from "@/module/bill/entities/bill.entity";
import { Booking } from "@/module/booking/entities/booking.entity";
import { User } from "@/module/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "payment" })
export class Payment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    date: Date;

    @Column()
    method: string;

    @Column()
    status: string;

    @Column()
    totalCost: number;

    @OneToOne(() => Booking, (booking) => booking.payment)
    @JoinColumn({ name: "bookingId" })
    booking: Booking;
}
