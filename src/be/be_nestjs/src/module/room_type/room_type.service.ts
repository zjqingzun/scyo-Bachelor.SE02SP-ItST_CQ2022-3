import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RoomType } from "./entites/room_type.entity";
import { DataSource, Repository } from "typeorm";
import { CreateRoomTypeDto } from "./dto/create-room_type.dto";
import { Hotel } from "../hotel/entities/hotel.entity";
import { UpdateRoomTypePriceDto } from "./dto/update-room_type-price.dto";

@Injectable()
export class RoomTypeService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(RoomType)
    private readonly roomtypeRepository: Repository<RoomType>,

  ) { }

  async addRoomType(hotelId: string, createRoomTypeDto: CreateRoomTypeDto) {
    try {
        const doubleRoom = {
            type: 2,
            price: createRoomTypeDto.doubleRoomPrice,
            weekendPrice: createRoomTypeDto.doubleRoomPrice + 150000,
            flexiblePrice: createRoomTypeDto.doubleRoomPrice + 200000,
            hotel: {id: hotelId},
            nums: 0,
            useFlexiblePrice: false,
            normalPrice: createRoomTypeDto.doubleRoomPrice
        };
        const quadRoom = {
            type: 4,
            price: createRoomTypeDto.quadRoomPrice,
            weekendPrice: createRoomTypeDto.quadRoomPrice + 150000,
            flexiblePrice: createRoomTypeDto.quadRoomPrice + 200000,
            hotel: {id: hotelId},
            nums: 0,
            useFlexiblePrice: false,
            normalPrice: createRoomTypeDto.quadRoomPrice
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

  async updatePriceOfRoomType(hotelId: number, type: number, updatePriceDto: UpdateRoomTypePriceDto) {
    try {
        const queryRunner = this.dataSource.createQueryRunner();
        const res = await queryRunner.manager.query(`
            UPDATE room_type
            SET price = $1, weekend_price = $2, flexible_price = $3, "useFlexiblePrice" = $4
            WHERE type = $5 AND "hotelId" = $6    
        `, [
            updatePriceDto.price,
            updatePriceDto.weekendPrice,
            updatePriceDto.flexiblePrice,
            updatePriceDto.useFlexiblePrice,
            type,
            hotelId
        ]);
        return {
            status: 200,
            message: "Successfully",
        };
    } catch (error) {
        console.error('Error when update price for rooms:', error);
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

  async updateNumOfRoomType(num: number, type: number, hotelId: number) {
    try {
        const queryRunner = this.dataSource.createQueryRunner();
        const res = await queryRunner.manager.query(`
            UPDATE room_type
            SET nums = nums + $1
            WHERE "hotelId" = $2 AND type = $3
        `, [num, hotelId, type]);
        queryRunner.release();
        return res;
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

  async getRoomTypeByHotelId(hotelId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    const roomtypes = await queryRunner.manager.query(`
        SELECT *
        FROM room_type
        WHERE "hotelId" = $1    
    `, [hotelId]);
    queryRunner.release();  
    return roomtypes;
  }
}