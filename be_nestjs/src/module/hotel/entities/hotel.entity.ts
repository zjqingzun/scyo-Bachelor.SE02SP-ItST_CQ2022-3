import { Location } from "@/module/location/entities/location.entity";
import { Report } from "@/module/report/entities/report.entity";
import { Review } from "@/module/review/entities/review.entity";
import { Room } from "@/module/room/entities/room.entity";
import { User } from "@/module/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: "hotel"})
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

    @OneToMany(() => Room, (room) => room.hotel )
    rooms: Room[];

    @ManyToOne(() => User, (user) => user.hotels)
    @JoinColumn({name: "ownerId"})
    owner: User;

    @OneToMany(() => Review, (review) => review.hotel)
    reviews: Review[];

    @ManyToMany(() => Location, (location) => location.hotels)
    locations: Location[];

    @OneToMany(() => Report, (report) => report.hotel)
    reports: Report[];
}
