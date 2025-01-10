import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
    try {
      const roomtypes = await this.roomtypeService.getRoomTypeByHotelId(hotelId);
      const roomtypeIds = roomtypes.map((roomtype: { id: any; }) => roomtype.id);
      const rooms = createRoomDtos.map(room => ({
        name: room.name,
        type: room.type,
        status: 'available',
        hotelId: hotelId,
        roomType: {id: roomtypeIds[(room.type / 2) - 1]}
      }));
      const queryBuilder = await this.roomRepository.createQueryBuilder()
        .insert()
        .into('room')
        .values(rooms)
        .execute();
      return {
        status: 200,
        message: "Successfully",
        rooms: queryBuilder.raw.map(hotel => hotel.id)
      }
    } catch (error) {
      console.error('Error creating rooms:', error);
      throw new HttpException(
        {
          status_code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Internal server error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
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

  async remove(id: number) {
    try {
      const res = await this.roomRepository.delete({id});
      if (res.affected > 0) {
        return {
          status: 200,
          message: "Successfully"
        }
      } else {
        throw new BadRequestException("Error when delete room");
      }
    } catch (error) {
      console.error('Error delete room:', error);
      throw new HttpException(
        {
          status_code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Internal server error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
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