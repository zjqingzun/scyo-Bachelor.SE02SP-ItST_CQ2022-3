import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Booking } from '@/module/booking/entities/booking.entity';
import { Room } from '@/module/room/entities/room.entity';

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

  @ManyToOne(() => Room, room => room.bookingRooms) // Thêm mối quan hệ với Room
  @JoinColumn({ name: 'roomId' }) // Liên kết cột roomId với bảng room
  room: Room; // Thêm quan hệ với Room entity
}
