import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Hotel } from '../hotel/entities/hotel.entity';
import { Room } from '../room/entities/room.entity';
import { RoomType } from '../room_type/entites/room_type.entity';
import { MinioService } from '@/minio/minio.service';
import { User } from '../user/entities/user.entity';
import { Request, Response } from 'express';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,

    @InjectRepository(Hotel)
    private readonly hotelRepository: Repository<Hotel>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,

    @InjectRepository(RoomType)
    private readonly roomTypeRepository: Repository<RoomType>,

    private readonly minioService: MinioService,
  ) { }

  async create(createBookingDto: CreateBookingDto, req: Request, res: Response) {
    try {
      const { idHotel, checkInDate, checkOutDate, roomType2, roomType4, sumPrice, userId } = createBookingDto;

      const hotelQuery = await this.hotelRepository
        .createQueryBuilder('hotel')
        .leftJoinAndSelect('hotel.locations', 'location')
        .select([
          'hotel.id AS id',
          'hotel.star AS star',
          'hotel.name AS name',
          'location.detailAddress AS address',
        ])
        .where('hotel.id = :idHotel', { idHotel })
      const hotel = await hotelQuery.getRawOne();
      console.log('HOTEL: ', hotel);

      // Tạm thời xử lý với phòng có trường là available trước
      // Lấy ra danh sách phòng của khách sạn 
      const roomQuery = await this.roomRepository
        .createQueryBuilder('room')
        .leftJoin('room.hotel', 'hotel')
        .select([
          'room.id AS id',
          'room.name AS name',
          'room.type AS type',
          'room.status AS status',
          'room.hotelId AS hotelid'
        ])
        .where('hotel.id = :idHotel', { idHotel })
        .andWhere('room.status = :status', { status: 'available' });
      const rooms = await roomQuery.getRawMany();
      console.log('ROOMS: ', rooms);

      // Lấy ra phòng loại 2 và 4
      const roomsType2 = rooms.filter(room => room.type === 2);
      const roomsType4 = rooms.filter(room => room.type === 4);

      const getRandomRooms = (roomsList: any[], count: number) => {
        const shuffled = roomsList.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
      };

      // Lấy random ra số lượng phòng cho khách hàng
      const randomRoomsType2 = getRandomRooms(roomsType2, roomType2);
      const randomRoomsType4 = getRandomRooms(roomsType4, roomType4);
      const selectedRooms = [...randomRoomsType2, ...randomRoomsType4];
      console.log('SELECTED ROOMS: ', selectedRooms);

      const roomIds = selectedRooms.map(room => room.id);
      await this.roomRepository
        .createQueryBuilder()
        .update()
        .set({ status: 'pending' })
        .where('id IN (:...roomIds)', { roomIds })
        .execute();

      const bookingData = {
        hotel: {
          star: hotel.star,
          name: hotel.name,
          address: hotel.address,
        },
        userId,
        checkInDate,
        checkOutDate,
        roomType2,
        roomType4,
        sumPrice,
        rooms: selectedRooms,
        createdAt: Date.now(),
      };

      // console.log('BOOKING DATA: ', bookingData);

      // Lưu vào cookie với thời gian hết hạn là 5 phút
      res.cookie('bookingData', JSON.stringify(bookingData), {
        maxAge: 5 * 60 * 1000,
        httpOnly: true,
      });

      return res.status(200).json({
        message: 'Booking data saved to cookie',
        bookingData,
      });

    } catch (error) {
      console.error('Error booking hotels:', error);

      throw new HttpException(
        {
          status_code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Internal server error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Kiểm tra xem booking còn hạn không
  async checkBooking(req: Request, res: Response) {
    try {
      const bookingData = req.cookies['bookingData'];

      if (!bookingData) {
        throw new HttpException('Booking data not found in cookies', HttpStatus.NOT_FOUND);
      }

      const parsedBookingData = JSON.parse(bookingData);
      const currentTime = Date.now();

      // Kiểm tra xem cookie có hết hạn chưa (5 phút trong trường hợp này)
      const isExpired = currentTime - parsedBookingData.createdAt > 5 * 60 * 1000;

      if (isExpired) {
        throw new HttpException('Booking data has expired', HttpStatus.FORBIDDEN);
      }

      return res.status(HttpStatus.OK).json({
        message: 'Booking data is valid',
        bookingData: parsedBookingData,
      });

    } catch (error) {
      console.error('Error checking booking:', error);

      return res.status(HttpStatus.FORBIDDEN).json({
        message: 'Booking data has expired or not found',
      });
    }
  }

  findAll() {
    return `This action returns all booking`;
  }

  findOne(id: number) {
    return `This action returns a #${id} booking`;
  }

  update(id: number, updateBookingDto: UpdateBookingDto) {
    return `This action updates a #${id} booking`;
  }

  remove(id: number) {
    return `This action removes a #${id} booking`;
  }
}
