import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Public } from '@/helpers/decorator/public';
import { BookingService } from '../booking/booking.service';

@Controller('callback')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly bookingService: BookingService,
  ) {}

  // [POST]: Momo tự động 
  @Post()
  @Public()
  async handlePaymentCallback(
    @Body() body: any,
    @Req() req,
    @Res() res,
  ) {
    return await this.bookingService.updatePaymentStatus(req, res, body);
  }

  @Get('/delete-cookie')
  @Public()
  async deleteCookie(
    @Res() res
  ){
    return await this.paymentService.deleteCookie(res);
  }

  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.create(createPaymentDto);
  }

  @Get()
  findAll() {
    return this.paymentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentService.update(+id, updatePaymentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentService.remove(+id);
  }
}
