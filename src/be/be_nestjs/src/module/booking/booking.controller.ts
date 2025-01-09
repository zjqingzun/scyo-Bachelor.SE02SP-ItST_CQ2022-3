import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Public } from '@/helpers/decorator/public';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) { }

  // [GET]: /booking
  @Get()
  @Public()
  async check(
    @Req() req,
    @Res() res
  ){
    return await this.bookingService.checkBooking(req, res);
  }


  // [POST]: /booking/start
  @Post('start')
  @Public()
  async create(
    @Body() createBookingDto: CreateBookingDto,
    @Req() req,
    @Res() res
  ) {
    return await this.bookingService.create(createBookingDto, req, res);
  }

  @Get()
  findAll() {
    return this.bookingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingService.update(+id, updateBookingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookingService.remove(+id);
  }
}
