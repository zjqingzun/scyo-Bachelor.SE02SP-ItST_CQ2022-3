import { Body, Controller, Param, Post } from "@nestjs/common";
import { RoomTypeService } from "./room_type.service";
import { Public } from "@/helpers/decorator/public";
import { CreateRoomTypeDto } from "./dto/create-room_type.dto";

 
@Controller('room_types')
export class RoomTypeController {
    constructor(private readonly roomtypeService: RoomTypeService) {}

    @Post('add/:hotelId')
    @Public()
    async addRoomType(@Param('hotelId') hotelId : string, @Body() createRoomTypeDto: CreateRoomTypeDto) {
        return await this.roomtypeService.addRoomType(hotelId, createRoomTypeDto);
    }
}
 