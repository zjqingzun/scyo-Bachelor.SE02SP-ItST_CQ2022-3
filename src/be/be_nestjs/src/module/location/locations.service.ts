import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { Repository } from 'typeorm';
import { Location } from './entities/location.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class LocationsService {

  constructor(
    @InjectRepository(Location)
    private readonly locationRepository : Repository<Location>
  ) {

  }

  create(createLocationDto: CreateLocationDto) {
    return 'This action adds a new location';
  }

  async add(location) {
    try {
      return await this.locationRepository.createQueryBuilder()
        .insert()
        .into('location')
        .values(location)
        .execute();
    } catch (error) {
      throw new BadRequestException('Error when add location');
    }
  }

  findAll() {
    return `This action returns all locations`;
  }

  findOne(id: number) {
    return `This action returns a #${id} location`;
  }

  update(id: number, updateLocationDto: UpdateLocationDto) {
    return `This action updates a #${id} location`;
  }

  remove(id: number) {
    return `This action removes a #${id} location`;
  }

  
}
