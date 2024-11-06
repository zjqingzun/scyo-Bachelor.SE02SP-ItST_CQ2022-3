import { Hotel } from "@/module/hotel/entities/hotel.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: "image"})
export class Image {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    url: string;

    @ManyToOne(() => Hotel, (hotel) => hotel.images)
    @JoinColumn({name: "hotelId"})
    hotel: Hotel;
}
