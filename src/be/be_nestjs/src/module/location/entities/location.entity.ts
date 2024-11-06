import { Hotel } from "@/module/hotel/entities/hotel.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: "location"})
export class Location {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    district: string;

    @Column()
    detailAddress: string;

    @Column()
    city: string;

    @ManyToMany(() => Hotel,{cascade: true})
    hotels: Hotel[];
}
