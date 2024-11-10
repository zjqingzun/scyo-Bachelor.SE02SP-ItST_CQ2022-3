import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { ImageService } from './image.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { MinioService } from '@/minio/minio.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import path from 'path';
import * as fs from 'fs';
import { Public } from '@/helpers/decorator/public';

@Controller('image')
export class ImageController {
  constructor(
    private readonly imageService: ImageService,
    private readonly minioService: MinioService
  ) {}

  
}
