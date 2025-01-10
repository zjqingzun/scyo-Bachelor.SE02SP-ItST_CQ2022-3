import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, HttpCode, HttpStatus } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Public } from '@/helpers/decorator/public';
import { PaymentCallbackDto } from './dto/payment-callback.dto';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) { }

  // [GET]: /booking/check-booking --> Kiểm tra booking còn hạn không
  @Get('check-booking')
  @Public()
  async check(
    @Req() req,
    @Res() res
  ) {
    return await this.bookingService.checkBooking(req, res);
  }

  // [POST]: /booking/start
  @Post('start')
  @Public()
  async startBooking(
    @Body() createBookingDto: CreateBookingDto,
    @Req() req,
    @Res() res
  ) {
    return await this.bookingService.create(createBookingDto, req, res);
  }

  // [GET]: /booking/information
  @Get('information')
  @Public()
  async getInformation(
    @Req() req
  ) {
    return await this.bookingService.getInformation(req);
  }

  // [POST]: /booking/information
  @Post('information')
  @Public()
  async addInformation(
    @Res() res,
    @Body() note: string
  ) {
    return await this.bookingService.addNote(res, note);
  }

  // [POST]: /booking/finish
  @Post('finish')
  @Public()
  async finishBooking(
    @Body() body: { paymentMethod: string },
    @Req() req,
    @Res() res,
  ) {
    const paymentMethod = body.paymentMethod;
    return this.bookingService.processPayment(req, res, paymentMethod);
  }

  // [POST]: 
  @Post('callback')
  @Public()
  async handlePaymentCallback(
    @Body() detailPay: PaymentCallbackDto,
    @Req() req,
    @Res() res,
  ) {
    return this.bookingService.updatePaymentStatus(req, res, detailPay);
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

  @Get('reservation')
  async bookRoom(createBookingDto: CreateBookingDto) {

  }

  // Room (Reservation)
  @Get('total/r/:id')
  @Public()
  async getTotalResservation(@Param('id') id: number) {
    return await this.bookingService.totalReservation(id);
  }

  // Room (checkin)
  @Get('total/i/:id')
  @Public()
  async getTotalCheckIn(@Param('id') id: number) {
    return await this.bookingService.totalcheckIn(id);
  }

  // Room (checkout)
  @Get('total/o/:id')
  @Public()
  async getTotalCheckOut(@Param('id') id: number) {
    return await this.bookingService.totalcheckOut(id);
  }

  
}