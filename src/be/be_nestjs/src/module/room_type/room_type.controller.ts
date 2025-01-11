import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RoomTypeService } from './room_type.service';
import { Public } from '@/helpers/decorator/public';
import { CreateRoomTypeDto } from './dto/create-room_type.dto';
import { UpdateRoomTypePriceDto } from './dto/update-room_type-price.dto';
import { Roles } from '@/helpers/decorator/roles';

@Controller('room_types')
export class RoomTypeController {
  constructor(private readonly roomtypeService: RoomTypeService) {}

  @Post('add/:hotelId')
  @Public()
  async addRoomType(
    @Param('hotelId') hotelId: string,
    @Body() createRoomTypeDto: CreateRoomTypeDto,
  ) {
    return await this.roomtypeService.addRoomType(hotelId, createRoomTypeDto);
  }

  @Get(':hotelId')
  @Roles('hotelier')
  async getRoomType(@Param('hotelId') hotelId: string) {
    return await this.roomtypeService.getRoomTypeByHotelId(hotelId);
  }

  @Post('price/:hotelId/:type')
  @Roles('hotelier')
  async updatePrice(
    @Param('hotelId') hotelId: string,
    @Param('type') type: string,
    @Body() updatePriceDto: UpdateRoomTypePriceDto,
  ) {
    return await this.roomtypeService.updatePriceOfRoomType(
      +hotelId,
      +type,
      updatePriceDto,
    );
  }

  @Get('price/isFlexiblePrice/:hotelId/:type/:isUse')
  @Roles('hotelier')
  async updateUseFlexiblePrice(
    @Param('hotelId') hotelId: string,
    @Param('type') type: string,
    @Param('isUse') isUse: boolean,
  ) {
    return await this.roomtypeService.updateUseFlexiblePrice(
      +hotelId,
      type,
      isUse,
    );
  }
}
