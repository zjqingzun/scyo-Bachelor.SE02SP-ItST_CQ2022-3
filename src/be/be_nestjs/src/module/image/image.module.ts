import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { Image } from './entities/image.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MinioService } from '@/minio/minio.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Image]),
  ],
  controllers: [ImageController],
  providers: [ImageService, MinioService],
  exports: [ImageService]
})
export class ImageModule {}
