import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Request } from 'express';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from '@/helpers/decorator/public';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { MinioService } from '@/minio/minio.service';
import { Roles } from '@/helpers/decorator/roles';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('error')
  getError() {
    return new ForbiddenException('forbidden', 'forbidden desc');
  }

  @Get('getAll/:role')
  @Roles('admin')
  async getAllUsers(@Param('role') role: string, @Req() req) {
    return await this.userService.findAll(role, req);
  }

  @Post('create')
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @Post('update')
  async update(@Body() updateUserDto: UpdateUserDto) {
    let result = await this.userService.update(updateUserDto);
    if (result.affected === 0) {
      throw new BadRequestException('no record has been updated');
    }
    return {
      status: 201,
      message: 'Updated',
    };
  }

  @Post('avatar/upload/:email')
  @Roles('user', 'hotelier')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
    }),
  )
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Param('email') email: string,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    await this.userService.uploadAvatar(file, email);
    return {
      message: 'Avatar has uploaded',
      image: await this.getImageUrl(email),
    };
  }

  @Get('avatar/url/:email')
  @Roles('user', 'hotelier')
  async getImageUrl(@Param('email') email: string) {
    const result = await this.userService.getAvatarUrl(email);
    return result;
  }

  @Delete('delete/:id')
  @Roles('admin')
  async delete(@Param('id') id: number) {
    return await this.userService.remove(+id);
  }

  @Get('fav')
  @Roles('user')
  async getFavs(@Req() req) {
    return await this.userService.findAllFav(req);
  }

  @Get('addFav')
  @Roles('user')
  async addFav(@Req() req) {
    return await this.userService.addFav(req);
  }

  @Get('deleteFav')
  @Roles('user')
  async deleteFav(@Req() req) {
    return await this.userService.deleteFav(req);
  }

  @Get('hotelier/dashboard/:hotelierId')
  @Roles('hotelier')
  async dashboardForHotelier(@Param('hotelierId') hotelierId: string) {
    return this.userService.dashboardForHotelier(
      hotelierId as unknown as number,
    );
  }

  @Get('admin/dashboard/t/user')
  @Public()
  async getTotalUsers() {
    return await this.userService.totalUsers();
  }

  @Get('admin/dashboard/t/hotel')
  @Roles('admin')
  async getTotalHotels() {
    return await this.userService.totalHotels();
  }
}
