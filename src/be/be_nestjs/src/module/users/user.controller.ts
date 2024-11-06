import { BadRequestException, Body, Controller, Delete, ForbiddenException, Get, HttpException, HttpStatus, Param, ParseIntPipe, Patch, Post, Req, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Request } from 'express';
import { UpdateUserDto } from './dto/update-user.dto';


@Controller('users')
export class UserController {
    constructor(private userService : UserService) {}

  @Get('error')
  getError() {
    return new ForbiddenException("forbidden", "forbidden desc");
  }

  @Get('getAll')
  async getAllUsers(@Req() req ) {
    return await this.userService.findAll(req);
  }

  @Post('create')
  async create(@Body() createUserDto : CreateUserDto) {
    console.log(createUserDto);
    return await this.userService.create(createUserDto);
  }

  @Patch('update')
  async update(@Body() updateUserDto: UpdateUserDto) {
  let result = await this.userService.update(updateUserDto);
  if (result.affected === 0) {
    throw new BadRequestException("no record has been updated");
  }
  return "Updated";
  }

  @Delete('delete/:id')
  async delete(@Param('id') id : number) {
    return await this.userService.remove(+id);
  }
}
