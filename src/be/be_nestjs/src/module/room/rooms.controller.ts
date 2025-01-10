import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Public } from '@/helpers/decorator/public';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post(':hotelId')
  @Public()
  create(@Param('hotelId') hotelId: string, @Body() createRoomDtos: CreateRoomDto[]) {
    return this.roomsService.create(createRoomDtos, hotelId);
  }

  @Get(':hotelId')
  @Public()
  async findAll(@Param('hotelId') hotelId: string, @Query() query) {
    return await this.roomsService.findAll(+hotelId, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomsService.update(+id, updateRoomDto);
  }

  @Delete(':id')
  @Public()
  remove(@Param('id') id: string) {
    return this.roomsService.remove(+id);
  }

  // Room (booked)
  @Get('total/b/:id')
  @Public()
  async getTotalOccupiedRooms(@Param('id') id: number) {
    return await this.roomsService.totalOccupied(id);
  }

  // Room (available)
  @Get('total/a/:id')
  @Public()
  async getTotalAvailableRooms(@Param('id') id: number) {
    return await this.roomsService.totalAvailable(id);
  }
}
