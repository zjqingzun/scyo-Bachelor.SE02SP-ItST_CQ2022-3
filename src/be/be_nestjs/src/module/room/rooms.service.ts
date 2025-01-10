import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './entities/room.entity';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
  ) {}

  create(createRoomDto: CreateRoomDto) {
    return 'This action adds a new room';
  }

  findAll() {
    return `This action returns all rooms`;
  }

  findOne(id: number) {
    return `This action returns a #${id} room`;
  }

  update(id: number, updateRoomDto: UpdateRoomDto) {
    return `This action updates a #${id} room`;
  }

  remove(id: number) {
    return `This action removes a #${id} room`;
  }


  async totalOccupied(id: number) {
    try {
      const total = await this.roomRepository
        .createQueryBuilder('room')
        .innerJoin('room.hotel', 'hotel') 
        .where('hotel.id = :hotelId', { hotelId: id }) 
        .andWhere('room.status = :status', { status: 'booked' })
        .getCount(); 
  
      return {
        status: 200,
        hotelId: id,
        total: total,
      };
    } catch (error) {
      throw new Error(`Error fetching total occupied rooms: ${error.message}`);
    }
  }

}