import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { DataSource, Repository } from 'typeorm';
import { Image } from './entities/image.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MinioService } from '@/minio/minio.service';
import { ConfigService } from '@nestjs/config';
import { Hotel } from '../hotel/entities/hotel.entity';

@Injectable()
export class ImageService {

  constructor(
    private dataSource: DataSource,

    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,

    private readonly minioService: MinioService,
    private readonly configService : ConfigService
  ) {

  }

  async uploadHotelImages(images: Express.Multer.File[], hotel: Hotel) {
    try {
      const bucketName = "bookastay";
      const minioServer = this.configService.get<string>('MINIO_ENDPOINT');
      const imageObjects = [];
      const uploadPromises = images.map(async image => {
        const objectName = `hotel_images/${image.originalname}`;
        await this.minioService.uploadFile(
          bucketName,
          objectName,
          image.buffer
        );

        imageObjects.push({
          url: `http://${minioServer}:9000/${bucketName}/${objectName}`,
          hotel
        });
      });
  
      await Promise.all(uploadPromises);

      await this.imageRepository.insert(imageObjects);
      const imageUrls = imageObjects.map(object => object.url);
      return imageUrls;
    } catch (error) {
      throw new BadRequestException('error when upload hotel images');
    }
  }
}
