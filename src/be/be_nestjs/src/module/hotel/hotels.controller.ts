import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { Public } from '@/helpers/decorator/public';

import { HotelsService } from './hotels.service';

import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { SearchHotelDto } from './dto/search-hotel.dto';
import { DetailHotelDto } from './dto/detail-hotel.dto';

@Controller('hotels')
export class HotelsController {
  constructor(private readonly hotelsService: HotelsService) {}

  @Post()
  create(@Body() createHotelDto: CreateHotelDto) {
    return this.hotelsService.create(createHotelDto);
  }

  @Get('getAll')
  @Public()
  findAll(@Req() req) {
    return this.hotelsService.findAll(req);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHotelDto: UpdateHotelDto) {
    return this.hotelsService.update(+id, updateHotelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.hotelsService.remove(+id);
  }

  // [GET]: /hotels/recommended-hotel
  @Get('recommended-hotel/:userId')
  @Public()
  async recommendedHotel(@Param('userId') userId: string) {
    return await this.hotelsService.getTopTenRatingHotel(+userId);
  }

  // [GET]: /hotels?city=...&checkInDate=...&checkOutDate=...&roomType2=...&roomType4=...&minPrice=...&maxPrice=...&minRating=...&minStar=...&page=...&perPage=...
  @Get('search/:userId')
  @Public()
  async findAvailableHotels(@Param('userId') userId: string, @Query() searchHotelDto: SearchHotelDto) {
    return await this.hotelsService.findAvailableHotels(searchHotelDto, +userId);
  }

  // [GET]: /hotels/:id?checkInDate=...&checkOutDate=...&roomType2=...&roomType4=...
  @Get(':id')
  @Public()
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query() detailHotelDto: DetailHotelDto,
  ) {
    return await this.hotelsService.findOne(id, detailHotelDto);
  }

  @Get('admin/dashboard/t/request')
  @Public()
  async totalDashboardRequest() {
    return await this.hotelsService.totalRequest();
  }

  @Get('admin/dashboard/ga/request')
  @Public()
  async getDashboardRequest() {
    return await this.hotelsService.getRequest();
  }

}
