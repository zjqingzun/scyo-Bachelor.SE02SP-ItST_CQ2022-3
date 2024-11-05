import { Bill } from "@/module/bill/entities/bill.entity";
import { Booking } from "@/module/booking/entities/booking.entity";
import { Hotel } from "@/module/hotel/entities/hotel.entity";
import { Review } from "@/module/review/entities/review.entity";
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: "user"})
export class User {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    phone: string;

    @Column({ default: "user"})
    role: string;

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

    @OneToMany(() => Review, (review) => review.user)
    reviews: Review[];

    @OneToMany(() => Bill, (bill) => bill.user)
    bills: Bill[];
}