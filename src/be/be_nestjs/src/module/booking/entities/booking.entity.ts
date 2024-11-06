import { Bill } from "@/module/bill/entities/bill.entity";
import { Payment } from "@/module/payment/entities/payment.entity";
import { Room } from "@/module/room/entities/room.entity";
import { User } from "@/module/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: "booking"})
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
    nums: number;

    @Column()
    status: string;

    @Column()
    note: string;

    @ManyToOne(() => User, (user) => user.bookings)
    @JoinColumn({name: "userId"})
    user: User;

    @OneToOne(() => Room, (room) => room.booking)
    @JoinColumn({name: "roomId"})
    room: Room;

    @OneToOne(() => Bill, (bill) => bill.booking)
    @JoinColumn()
    bill: Bill;
}
