import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Booking } from '@/module/booking/entities/booking.entity';

@Entity('booking_room')
export class BookingRoom {
  
  @PrimaryGeneratedColumn()
  id: number; 

  @Column()
  bookingId: number;

  @Column()
  type: number;

  @Column({ type: 'varchar', nullable: true })
  room_name: string; 

  @ManyToOne(() => Booking, booking => booking.bookingRooms, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bookingId' })
  booking: Booking;
}
