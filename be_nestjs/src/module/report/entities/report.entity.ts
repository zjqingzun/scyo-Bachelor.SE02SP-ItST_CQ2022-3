import { Hotel } from "@/module/hotel/entities/hotel.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'report'})
export class Report {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    startDate: Date;

    @Column({type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    endDate: Date;

    @Column()
    totalProfit: number;

    @ManyToOne(() => Hotel, (hotel) => hotel.reports)
    @JoinColumn({name: "hotelId"})
    hotel: Hotel;
}
