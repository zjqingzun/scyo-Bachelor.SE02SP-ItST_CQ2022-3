import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RoomType } from "./entites/room_type.entity";
import { Repository } from "typeorm";
import { CreateRoomTypeDto } from "./dto/create-room_type.dto";

@Injectable()
export class RoomTypeService {
  constructor(
    @InjectRepository(RoomType)
    private readonly roomtypeRepository: Repository<RoomType>,

  ) { }

  async addRoomType(hotelId: string, createRoomTypeDto: CreateRoomTypeDto) {
    try {
        console.log(createRoomTypeDto);
        const doubleRoom = {
            type: 2,
            price: createRoomTypeDto.doubleRoomPrice,
            weekendPrice: createRoomTypeDto.doubleRoomPrice + 150000,
            flexiblePrice: createRoomTypeDto.doubleRoomPrice + 0,
            hotel: {id: hotelId},
            nums: 0
        };
        const quadRoom = {
            type: 4,
            price: createRoomTypeDto.quadRoomPrice,
            weekendPrice: createRoomTypeDto.quadRoomPrice + 150000,
            flexiblePrice: createRoomTypeDto.quadRoomPrice + 0,
            hotel: {id: hotelId},
            nums: 0
        };
        const queryBuilder = await this.roomtypeRepository.createQueryBuilder()
            .insert()
            .into('room_type')
            .values([doubleRoom, quadRoom])
            .execute();
        return {
            status: 200,
            message: "Successfully",
            roomtype: queryBuilder.raw.map((obj: { id: number; }) => obj.id)
        };
    } catch (error) {
        console.error('Error when set price for rooms:', error);
        throw new HttpException(
            {
            status_code: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Internal server error. Please try again later.',
            error: error.message || 'Unknown error',
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
  }
}