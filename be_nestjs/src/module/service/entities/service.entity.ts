import { Room } from "@/module/room/entities/room.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: "service"})
export class Service {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToMany(() => Room, (room) => room.services)
    rooms: Room[];
}
