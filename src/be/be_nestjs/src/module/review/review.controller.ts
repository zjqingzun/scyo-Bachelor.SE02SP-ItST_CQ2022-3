import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { GetReviewDto } from './dto/get-review.dto';
import { Public } from '@/helpers/decorator/public';
import { publishBehavior } from 'rxjs';
import { Roles } from '@/helpers/decorator/roles';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post('create')
  @Roles('user')
  create(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewService.create(createReviewDto);
  }

  @Get("detail/:id")
  @Public()
  getReviewByReviewId(@Param('id') id: string) {
    return this.reviewService.getReviewById(id);
  }

  @Get()
  findAll() {
    return this.reviewService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.reviewService.findOne(+id);
  // }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewService.update(+id, updateReviewDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewService.remove(+id);
  }



  // [GET]: /review/:id?page=1&per_page=6
  @Get(':id')
  @Public()
  findReviewByID(
    @Param('id', ParseIntPipe) id: number,
    @Query() getReviewDto: GetReviewDto,
  ) {
    return this.reviewService.getHotelReviews(id, getReviewDto);
  }
}
