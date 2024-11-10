import { Hotel } from "@/module/hotel/entities/hotel.entity";
import { User } from "@/module/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: "review"})
export class Review {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    comment: string;

    @Column()
    rating: number;

    @CreateDateColumn({
        default: `now()`,
        nullable: true,
    })
    createdAt: string

    @ManyToOne(() => User, (user) => user.reviews)
    @JoinColumn({name: "userId"})
    user: User;

    @ManyToOne(() => Hotel, (hotel) => hotel.reviews)
    @JoinColumn({name: "hotelId"})
    hotel: Hotel;
}
