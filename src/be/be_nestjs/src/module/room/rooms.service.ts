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
      const doubleRooms = rooms.filter(room => room.type === 2);
      const quadRooms = rooms.filter(room => room.type === 4);
      console.log(doubleRooms.length, quadRooms.length);
      const queryBuilder = await this.roomRepository.createQueryBuilder()
        .insert()
        .into('room')
        .values(rooms)
        .execute();
      if (doubleRooms.length > 0) {
        await this.roomtypeService.updateNumOfRoomType(doubleRooms.length, 2, +hotelId);
      }
      if (quadRooms.length > 0) {
        await this.roomtypeService.updateNumOfRoomType(quadRooms.length, 4, +hotelId);
      }
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

  async findAll(hotelId: number, query: any) {
    try {
      const {page = 1, limit = 5, sortBy = 'id', order = 'ASC', searchTerm} = query;
      const take = limit;

      const [rooms, total] = await this.roomRepository.createQueryBuilder('room')
        .leftJoinAndSelect('room.hotel', 'hotel') 
        .leftJoinAndSelect('room.roomType', 'roomType') 
        .select(['room', 'roomType.price'])
        .where('room.hotelId = :hotelId', { hotelId })
        .take(limit)
        .skip((+page - 1) * +limit)
        .getManyAndCount();
      const res = rooms.map(room => ({
        id: room.id,
        name: room.name,
        type: room.type,
        price: room.roomType.price,
        status: room.status
      }));
      return {
        status: 200,
        message: "Successfully",
        data: {
          all_page: Math.ceil(total / +limit),
          total,
          rooms: res
        }
      };
    } catch (error) {
      console.error('Error getting room by hotelid:', error);
      throw new HttpException(
        {
          status_code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Internal server error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
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