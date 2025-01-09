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
import { BookingDetail } from '../booking_detail/entities/booking_detail.entity';
import { BookingController } from './booking.controller';
import { notEqual } from 'node:assert';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,

    @InjectRepository(BookingDetail)
    private readonly bookingDetailRepository: Repository<BookingDetail>,


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
      const { hotelId, checkInDate, checkOutDate, roomType2, roomType4, type2Price, type4Price, sumPrice, userId } = createBookingDto;
      // const hotelQuery = await this.hotelRepository
      //   .createQueryBuilder('hotel')
      //   .leftJoinAndSelect('hotel.locations', 'location')
      //   .select([
      //     'hotel.id AS id',
      //     'hotel.star AS star',
      //     'hotel.name AS name',
      //     'location.detailAddress AS address',
      //   ])
      //   .where('hotel.id = :idHotel', { hotelId })
      // const hotel = await hotelQuery.getRawOne();
      // console.log('HOTEL: ', hotel);

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
        .where('hotel.id = :hotelId', { hotelId })
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
        hotelId,
        userId,
        checkInDate,
        checkOutDate,
        roomType2,
        type2Price,
        roomType4,
        type4Price,
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

  async getInformation(req: Request){
    try {
      const bookingDT = req.cookies['bookingData'];
      if (!bookingDT) {
        throw new HttpException('Booking data not found in cookies', HttpStatus.NOT_FOUND);
      }
      const bookingData = JSON.parse(bookingDT);
      console.log('BOOKING DATA: ', bookingData);

      // Lấy ra thông tin hotel
      const hotelId = bookingData.hotelId;
      const hotelQuery = await this.hotelRepository
        .createQueryBuilder('hotel')
        .leftJoinAndSelect('hotel.locations', 'location')
        .select([
          'hotel.id AS id',
          'hotel.star AS star',
          'hotel.name AS name',
          'location.detailAddress AS address',
        ])
        .where('hotel.id = :hotelId', { hotelId })
      const hotel = await hotelQuery.getRawOne();
      console.log('HOTEL: ', hotel);
      
      // Lấy ra thông tin người dùng
      const userId = bookingData.userId;
      const userQuery = await this.userRepository
      .createQueryBuilder('user')
      .select([
        'user.name AS name',
        'user.email AS email',
        'user.phone AS phone'
      ])
      .where('user.id = :userId', { userId })
      const user = await userQuery.getRawOne();
      console.log('USER: ', user);

      const data = {
        hotel: hotel,
        checkInDate: bookingData.checkInDate,  
        checkOutDate: bookingData.checkOutDate,
        roomType2: bookingData.roomType2,
        type2Price: bookingData.type2Price,
        roomType4: bookingData.roomType4,
        type4Price: bookingData.type4Price,
        sumPrice: bookingData.sumPrice,
        user: user,
      };

      return ({
        message: 'Get information from cookie successfully',
        data,
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

  async addNote(res: Response, note: string){
    try {
      res.cookie('note', JSON.stringify(note), {
        maxAge: 5 * 60 * 1000,
        httpOnly: true,
      });

      return res.status(HttpStatus.OK).json({
        message: 'Note added successfully to booking data',
        note
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

  async processPayment(req: Request, res: Response, paymentMethod){
    try {
      console.log('PAYMENTMETHOD: ', paymentMethod);
      // Kiểm tra xem có thông tin booking trong cookie không
      const bookingDT = req.cookies['bookingData'];
      const noteDT = req.cookies['note'];
      if (!bookingDT || !noteDT) {
        throw new HttpException('Booking data not found in cookies', HttpStatus.NOT_FOUND);
      }
      const bookingData = JSON.parse(bookingDT);
      const note = JSON.parse(noteDT);
      console.log('NOTE: ', note);
  
      let status = '';
      if (paymentMethod === 'cash') {
        status = 'unpaid';
        console.log('VAO DUOC PAYMENT CASH');
        console.log('BOOKING DATA TRUOC KHI VAO: ', bookingData);
        await this.saveDataIntoDatabase(bookingData, status, note);
      
        return res.status(HttpStatus.OK).json({
          message: 'Cash successful, information saved to database.',
        });
      }
  
      if (paymentMethod === 'momo') {
        status = 'paid';
        // Tạm thời chưa xử lý
      }
  
      // Trả về lỗi nếu phương thức thanh toán không hợp lệ
      throw new HttpException('Invalid payment method', HttpStatus.BAD_REQUEST);
      
    } catch (error) {
      console.error('Error processing payment:', error);
      throw new HttpException(
        {
          status_code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Internal server error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async saveBooking(bookingData: any, status: string, note) {
    try {
      console.log('BOOKING DATA: ', bookingData);
      console.log('BOOKING DATA USER ID: ', bookingData.userId);
      console.log('BOOKING DATA BEFORE QUERY: ', {
        userId: bookingData.userId,
        hotelId: bookingData.hotelId,
        checkInDate: bookingData.checkInDate,
        checkOutDate: bookingData.checkOutDate,
        status: status,
        note: note
      });
      const bookingQuery = await this.bookingRepository
        .createQueryBuilder()
        .insert()
        .into('booking')
        .values({
          userId: bookingData.userId,
          hotelId: bookingData.hotelId,
          checkInDate: bookingData.checkInDate,
          checkOutDate: bookingData.checkOutDate,
          status: status,
          note: note
        })
        .returning('id')
        .execute();
  
      return bookingQuery.raw[0].id; // Trả về bookingId để sử dụng ở các bước tiếp theo
  
    } catch (error) {
      console.error('Error saving booking:', error);
      throw new HttpException(
        {
          status_code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Internal server error while saving booking.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  
  private async saveBookingDetail(bookingId: number, bookingData: any) {
    try {
      const bookingDetailQuery = await this.bookingDetailRepository
        .createQueryBuilder()
        .insert()
        .into('booking_detail')
        .values([
          {
            bookingId: bookingId,
            type: 2,
            nums: bookingData.roomType2,
            price: bookingData.type2Price
          },
          {
            bookingId: bookingId,
            type: 4,
            nums: bookingData.roomType4,
            price: bookingData.type4Price
          }
        ])
        .execute();
    } catch (error) {
      console.error('Error saving booking detail:', error);
      throw new HttpException(
        {
          status_code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Internal server error while saving booking detail.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  
  private async saveDataIntoDatabase(bookingData: any, status: string, note: string) {
    try {
      const bookingId = await this.saveBooking(bookingData, status, note);
      console.log('BOOKING ID: ', bookingId);
      await this.saveBookingDetail(bookingId, bookingData);
      // await saveBookingRooms(bookingId, selectedRooms);
  
      // Có thể làm thêm các việc xử lý khác nếu cần
  
    } catch (error) {
      console.error('Error saving data into database:', error);
      throw new HttpException(
        {
          status_code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Internal server error while saving all data.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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

// async function saveDataIntoDatabase(bookingData: any, status: string, note: string) {
//   try {
//     // Đầu tiên là save vào bảng booking
//     const bookingQuery = await this.bookingRepository
//       .createQueryBuilder()
//       .insert()
//       .into('booking') 
//       .values({
//         hotelId: bookingData.hotelId,
//         userId: bookingData.userId,
//         createdAt: Date.now(), 
//         checkInDate: bookingData.checkInDate,
//         checkOutDate: bookingData.checkOutDate,
//         status: status,
//         sumPrice: bookingData.sumPrice,
//         note: note
//       })
//       .returning('id')
//       .execute(); 
//       const bookingId = bookingQuery.raw[0].id;

//       const bookingDetailQuery = await this.bookingDetailRepository
//       .createQueryBuilder('booking_detail')
//       .createQueryBuilder()
//       .insert()
//       .into('booking_detail')
//       .values([
//         {
//           bookingId: bookingId, 
//           type: 2,               
//           nums: bookingData.roomType2,
//           price: bookingData.type2Price
//         },
//         {
//           bookingId: bookingId,  
//           type: 4,               
//           nums: bookingData.roomType4,
//           price: bookingData.type4Price
//         }
//       ])
//       .execute();

//       // Chỗ này xử lý lưu vào bảng booking_room (Lấy các phòng ở trong list selected lưu vào)
      

//   } catch (error) {
//     console.error('Error saving booking with query builder:', error);
//     throw new HttpException(
//       {
//         status_code: HttpStatus.INTERNAL_SERVER_ERROR,
//         message: 'Internal server error while saving booking.',
//       },
//       HttpStatus.INTERNAL_SERVER_ERROR,
//     );
//   }
// }
