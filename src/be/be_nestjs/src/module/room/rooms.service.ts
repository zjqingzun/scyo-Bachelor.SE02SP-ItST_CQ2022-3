import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Room } from './entities/room.entity';
import { RoomTypeService } from '../room_type/room_type.service';

@Injectable()
export class RoomsService {
  constructor(
    private readonly roomtypeService: RoomTypeService,
    private readonly dataSource: DataSource,
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
  ) {}

  async create(createRoomDtos: CreateRoomDto[], hotelId: string) {
    const roomtypes = await this.roomtypeService.getRoomTypeByHotelId(hotelId);
    const roomtypeIds = roomtypes.map((roomtype: { id: any; }) => roomtype.id);
    const rooms = createRoomDtos.map(room => ({
      name: room.name,
      type: room.type,
      status: 'available',
      hotelId: hotelId,
      roomTypeId: roomtypeIds[(room.type / 2) - 1]
    }));
    return rooms;
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

  
  async totalAvailable(id: number) {
    try {
      const total = await this.roomRepository
        .createQueryBuilder('room')
        .innerJoin('room.hotel', 'hotel') 
        .where('hotel.id = :hotelId', { hotelId: id }) 
        .andWhere('room.status = :status', { status: 'available' })
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