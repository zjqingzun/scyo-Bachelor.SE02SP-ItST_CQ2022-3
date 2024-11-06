import { Booking } from "@/module/booking/entities/booking.entity";
import { Hotel } from "@/module/hotel/entities/hotel.entity";
import { Service } from "@/module/service/entities/service.entity";
import { User } from "@/module/users/entities/user.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: "room"})
export class Room {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    type: string;

    @Column()
    nums: number;

    @Column()
    price: number;

    @Column()
    status: string;

    @OneToOne(() => Booking, (booking) => booking.room)
    booking: Booking;

    @ManyToOne(() => Hotel, (hotel) => hotel.rooms)
    @JoinColumn({name: "hotelId"})
    hotel: Hotel;

    @ManyToMany(() => Service, (service) => service.rooms)
    @JoinTable({
        name: "rooms_services"
    })
    services: Service[];
}
