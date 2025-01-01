import { Booking } from "@/module/booking/entities/booking.entity";
import { Hotel } from "@/module/hotel/entities/hotel.entity";
import { RoomType } from "@/module/room_type/entites/room_type.entity";
import { Service } from "@/module/service/entities/service.entity";
import { User } from "@/module/user/entities/user.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "room" })
export class Room {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    type: number;

    @Column()
    status: string;

    @ManyToOne(() => Hotel, (hotel) => hotel.rooms)
    @JoinColumn({ name: "hotelId" })
    hotel: Hotel;

    // Quan hệ với RoomType (Một phòng thuộc một loại phòng)
    @ManyToOne(() => RoomType, (roomType) => roomType.rooms)
    @JoinColumn({ name: "roomTypeId" }) // Tạo khóa ngoại để liên kết với RoomType
    roomType: RoomType;
}
