import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
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
import { BookingRoom } from '../booking_room/entities/booking_room.entity';
import axios from 'axios';
import * as crypto from 'crypto';
import { Payment } from '../payment/entities/payment.entity';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,

    @InjectRepository(BookingDetail)
    private readonly bookingDetailRepository: Repository<BookingDetail>,

    @InjectRepository(BookingRoom)
    private readonly bookingRoomRepository: Repository<BookingRoom>,

    @InjectRepository(Hotel)
    private readonly hotelRepository: Repository<Hotel>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,

    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,

    @InjectRepository(RoomType)
    private readonly roomTypeRepository: Repository<RoomType>,

    private readonly minioService: MinioService,
  ) {}

  async create(
    createBookingDto: CreateBookingDto,
    req: Request,
    res: Response,
  ) {
    try {
      const {
        hotelId,
        checkInDate,
        checkOutDate,
        roomType2,
        roomType4,
        type2Price,
        type4Price,
        sumPrice,
        userId,
      } = createBookingDto;
      // Tạm thời xử lý với phòng có trường là available trước
      // Lấy ra danh sách phòng của khách sạn
      const availableRoomQuery = await this.roomRepository
        .createQueryBuilder('room')
        .leftJoin('room.hotel', 'hotel')
        .select([
          'room.id AS id',
          'room.name AS name',
          'room.type AS type',
          'room.status AS status',
          'room.hotelId AS hotelid',
        ])
        .where('hotel.id = :hotelId', { hotelId })
        .andWhere('room.status = :status', { status: 'available' });
      const availableRoom = await availableRoomQuery.getRawMany();
      console.log('AVAILABLE ROOMS: ', availableRoom);

      const canBookingQuery = await this.bookingRepository
        .createQueryBuilder('booking')
        .leftJoin('booking.bookingRooms', 'bookingRoom')
        .leftJoin('bookingRoom.room', 'room')
        .where('booking.hotelId = :hotelId', { hotelId })
        .andWhere(
          '(booking.checkinTime >= :checkOutDate OR booking.checkoutTime <= :checkInDate)',
          {
            checkInDate,
            checkOutDate,
          },
        )
        .select([
          'room.id AS id',
          'room.name AS name',
          'room.type AS type',
          'room.status AS status',
          'room.hotelId AS hotelid',
        ]);

      const canBooking = await canBookingQuery.getRawMany();
      // console.log('CAN BOOKING: ', canBooking);

      const rooms = [...availableRoom, ...canBooking];
      // console.log('ALL AVAILABLE ROOMS: ', rooms);
      // Lấy ra phòng loại 2 và 4
      const roomsType2 = rooms.filter((room) => room.type === 2);
      const roomsType4 = rooms.filter((room) => room.type === 4);

      const getRandomRooms = (roomsList: any[], count: number) => {
        const shuffled = roomsList.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
      };

      // Lấy random ra số lượng phòng cho khách hàng
      const randomRoomsType2 = getRandomRooms(roomsType2, roomType2);
      const randomRoomsType4 = getRandomRooms(roomsType4, roomType4);
      const selectedRooms = [...randomRoomsType2, ...randomRoomsType4];
      // console.log('SELECTED ROOMS: ', selectedRooms);

      const roomIds = selectedRooms.map((room) => room.id);
      if (!roomIds || roomIds.length === 0) {
        throw new BadRequestException('No room IDs provided');
      }
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

      const oldState = {
        hotelId,
        availableRoom,
        canBooking,
      };
      console.log('OLD STATE: ', oldState);
      res.cookie('oldState', JSON.stringify(oldState), {
        maxAge: 6 * 60 * 1000,
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

      // Kiểm tra cookie bookingData
      if (!bookingData) {
        const oldStateCookie = req.cookies['oldState'];

        const oldState = JSON.parse(oldStateCookie);
        const { hotelId, availableRoom, canBooking } = oldState;

        // Lấy danh sách ID từ availableRoom và canBooking
        const availableRoomIds = availableRoom.map((room) => room.id);
        const canBookingIds = canBooking.map((room) => room.id);

        // Cập nhật trạng thái "booked" cho các phòng trong canBooking
        if (canBookingIds.length > 0) {
          await this.roomRepository
            .createQueryBuilder()
            .update()
            .set({ status: 'booked' })
            .where('hotelId = :hotelId AND id IN (:...ids)', {
              hotelId,
              ids: canBookingIds,
            })
            .execute();
        }

        // Cập nhật trạng thái "available" cho các phòng trong availableRoom
        if (availableRoomIds.length > 0) {
          await this.roomRepository
            .createQueryBuilder()
            .update()
            .set({ status: 'available' })
            .where('hotelId = :hotelId AND id IN (:...ids)', {
              hotelId,
              ids: availableRoomIds,
            })
            .execute();
        }

        // Trả về lỗi phù hợp
        return res.status(HttpStatus.FORBIDDEN).json({
          status_code: HttpStatus.FORBIDDEN,
          message: 'Booking data has expired or not found',
        });
      }
      // Nếu có bookingData, phân tích và trả về kết quả
      const parsedBookingData = JSON.parse(bookingData);
      return res.status(HttpStatus.OK).json({
        status_code: HttpStatus.OK,
        message: 'Booking data is valid',
        bookingData: parsedBookingData,
      });
    } catch (error) {
      console.error('Error checking booking:', error);
    }
  }

  async getInformation(req: Request) {
    try {
      const bookingDT = req.cookies['bookingData'];
      if (!bookingDT) {
        throw new HttpException(
          'Booking data not found in cookies',
          HttpStatus.NOT_FOUND,
        );
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
        .where('hotel.id = :hotelId', { hotelId });
      const hotel = await hotelQuery.getRawOne();
      // console.log('HOTEL: ', hotel);

      // Lấy ra thông tin người dùng
      const userId = bookingData.userId;
      const userQuery = await this.userRepository
        .createQueryBuilder('user')
        .select([
          'user.name AS name',
          'user.email AS email',
          'user.phone AS phone',
        ])
        .where('user.id = :userId', { userId });
      const user = await userQuery.getRawOne();
      // console.log('USER: ', user);

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

      return {
        message: 'Get information from cookie successfully',
        data,
      };
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

  async addNote(res: Response, note: string) {
    try {
      res.cookie('note', JSON.stringify(note), {
        maxAge: 5 * 60 * 1000,
        httpOnly: true,
      });

      return res.status(HttpStatus.OK).json({
        message: 'Note added successfully to booking data',
        note,
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

  async processPayment(req: Request, res: Response, paymentMethod) {
    try {
      // console.log('PAYMENTMETHOD: ', paymentMethod);
      // Kiểm tra xem có thông tin booking trong cookie không
      const bookingDT = req.cookies['bookingData'];
      const noteDT = req.cookies['note'];
      if (!bookingDT || !noteDT) {
        throw new HttpException(
          'Booking data not found in cookies',
          HttpStatus.NOT_FOUND,
        );
      }
      const bookingData = JSON.parse(bookingDT);
      const note = JSON.parse(noteDT);
      // console.log('NOTE: ', note);

      if (paymentMethod === 'cash') {
        const paymentStatus = 'unpaid';
        const bookingStatus = 'confirmed';
        // console.log('VAO DUOC PAYMENT CASH');
        // console.log('BOOKING DATA TRUOC KHI VAO: ', bookingData);
        await this.saveDataIntoDatabase(
          bookingData,
          paymentStatus,
          bookingStatus,
          note,
          paymentMethod,
        );
        res.clearCookie('bookingData');
        return res.status(HttpStatus.OK).json({
          status_code: HttpStatus.OK,
          message: 'Cash successful, information saved to database.',
        });
      } else if (paymentMethod === 'momo') {
        const orderInfo = `Thanh toán đặt phòng khách sạn thông qua trang web đặt phòng BookAstay`;

        const paymentUrl = await this.createMomoPayment(
          res,
          orderInfo,
          bookingData,
          note,
        );
        console.log('Payment URL:', paymentUrl);
        return res.status(HttpStatus.OK).json({
          status_code: HttpStatus.OK,
          message: 'Redirect to MoMo for payment.',
          paymentUrl,
        });
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

  private async createMomoPayment(
    res: Response,
    orderInfo: string,
    bookingData,
    note,
  ) {
    const accessKey = process.env.MOMO_ACCESS_KEY;
    const secretKey = process.env.MOMO_SECRET_KEY;
    var orderInfo = orderInfo;
    var partnerCode = 'MOMO';
    var redirectUrl = 'http://localhost:3000/reserve';
    var ipnUrl = 'https://011b-2402-800-6315-309c-8dee-2102-d327-5d0a.ngrok-free.app/callback';
    var requestType = 'payWithMethod';
    var amount = bookingData.sumPrice;
    var orderId = partnerCode + new Date().getTime();
    var requestId = orderId;
    var orderGroupId = '';
    var autoCapture = true;
    var lang = 'vi';

    const extraData = Buffer.from(
      JSON.stringify({ bookingData, note }),
    ).toString('base64');

    //before sign HMAC SHA256 with format
    //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
    var rawSignature =
      'accessKey=' +
      accessKey +
      '&amount=' +
      amount +
      '&extraData=' +
      extraData +
      '&ipnUrl=' +
      ipnUrl +
      '&orderId=' +
      orderId +
      '&orderInfo=' +
      orderInfo +
      '&partnerCode=' +
      partnerCode +
      '&redirectUrl=' +
      redirectUrl +
      '&requestId=' +
      requestId +
      '&requestType=' +
      requestType;
    //puts raw signature
    console.log('--------------------RAW SIGNATURE----------------');
    console.log(rawSignature);
    //signature
    const crypto = require('crypto');
    var signature = crypto
      .createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex');
    console.log('--------------------SIGNATURE----------------');
    console.log(signature);

    //json object send to MoMo endpoint
    const requestBody = JSON.stringify({
      partnerCode: partnerCode,
      partnerName: 'Test',
      storeId: 'MomoTestStore',
      requestId: requestId,
      amount: amount,
      orderId: orderId,
      orderInfo: orderInfo,
      redirectUrl: redirectUrl,
      ipnUrl: ipnUrl,
      lang: lang,
      requestType: requestType,
      autoCapture: autoCapture,
      extraData: extraData,
      orderGroupId: orderGroupId,
      signature: signature,
    });

    // Option for axios
    const options = {
      method: 'POST',
      url: 'https://test-payment.momo.vn/v2/gateway/api/create',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestBody),
      },
      data: requestBody,
    };

    try {
      // Make HTTP request using axios
      const response = await axios(options);
      const result = response.data;

      if (result && result.payUrl) {
        return result.payUrl;
      } else {
        throw new Error('Failed to get payment URL from MoMo.');
      }
    } catch (error) {
      console.error(
        'Error creating MoMo payment:',
        error.response?.data || error.message,
      );
      throw new HttpException(
        'Error creating MoMo payment',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updatePaymentStatus(req: Request, res: Response, body) {
    // console.log('BODY: ', body);
    const extraData = Buffer.from(body.extraData, 'base64').toString('utf-8');
    const { bookingData, note } = JSON.parse(extraData);
    // console.log('NOTE: ', note);
    const resultCode = body.resultCode;
    if (resultCode === 0) {
      const paymentStatus = 'paid';
      const bookingStatus = 'confirmed';
      this.saveDataIntoDatabase(
        bookingData,
        paymentStatus,
        bookingStatus,
        note,
        'momo',
      );
      return res.status(HttpStatus.OK).json({
        message: 'Payment success, save data into database',
        data: { paymentStatus, bookingData },
      });
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Payment failed, please try again.',
      });
    }
  }

  private async saveBooking(bookingData: any, status: string, note) {
    try {
      const userId = bookingData.userId;
      const hotelId = bookingData.hotelId;
      const checkInDate = bookingData.checkInDate;
      const checkOutDate = bookingData.checkOutDate;
      const bookingQuery = await this.bookingRepository
        .createQueryBuilder()
        .insert()
        .into('booking')
        .values({
          user: { id: userId },
          hotel: { id: hotelId },
          checkinTime: checkInDate,
          checkoutTime: checkOutDate,
          status: status,
          note: note.note,
        })
        .returning('id')
        .execute();

      return bookingQuery.raw[0].id; // Trả về bookingId để sử dụng ở các bước tiếp theo
    } catch (error) {
      console.error('Error saving booking:', error);
      throw error;
    }
  }

  private async saveBookingDetail(bookingId: number, bookingData: any) {
    try {
      // console.log('BOOKING ID BEFORE QUERY: ', bookingId);
      // console.log('BOOKING DATA: ', bookingData);
      const bookingDetailQuery = await this.bookingDetailRepository
        .createQueryBuilder()
        .insert()
        .into(BookingDetail)
        .values([
          {
            booking: { id: bookingId },
            type: '2',
            nums: bookingData.roomType2,
            price: bookingData.type2Price,
          },
          {
            booking: { id: bookingId },
            type: '4',
            nums: bookingData.roomType4,
            price: bookingData.type4Price,
          },
        ])
        .execute();
    } catch (error) {
      console.error('Error saving booking detail:', error);
      throw error;
    }
  }

  private async saveBookingRoom(bookingId: number, bookingData: any) {
    try {
      const bookingRoomQuery = await this.bookingRoomRepository
        .createQueryBuilder()
        .insert()
        .into(BookingRoom)
        .values(
          bookingData.rooms.map((room) => ({
            booking: { id: bookingId },
            type: room.type,
            room_name: room.name,
            room: { id: room.id },
          })),
        )
        .execute();
    } catch (error) {
      console.error('Error saving booking detail:', error);
      throw error;
    }
  }

  private async createPayment(
    bookingId: number,
    bookingData: any,
    paymentMethod: string,
    status: string,
  ) {
    try {
      const paymentQuery = await this.paymentRepository
        .createQueryBuilder()
        .insert()
        .into(Payment)
        .values({
          method: paymentMethod,
          status: status,
          booking: { id: bookingId },
          totalCost: bookingData.sumPrice,
        })
        .execute();
    } catch (error) {
      console.error('Error saving payment:', error);
      throw error;
    }
  }

  private async setStatusRoom(bookingData: any) {
    try {
      const hotelId = bookingData.hotelId;
      const rooms = bookingData.rooms;
      const roomIds = rooms.map((room) => room.id);
      if (roomIds.length > 0) {
        // Cập nhật trạng thái "booked" cho các phòng đã được đặt thành công
        await this.roomRepository
          .createQueryBuilder()
          .update()
          .set({ status: 'booked' })
          .where('hotelId = :hotelId AND id IN (:...ids)', {
            hotelId,
            ids: roomIds,
          })
          .execute();
      }
    } catch (error) {
      console.error('Error saving payment:', error);
      throw error;
    }
  }

  private async saveDataIntoDatabase(
    bookingData: any,
    paymentStatus: string,
    bookingStatus: string,
    note: string,
    paymentMethod: string,
  ) {
    try {
      const bookingId = await this.saveBooking(
        bookingData,
        bookingStatus,
        note,
      );
      // console.log('BOOKING ID: ', bookingId);
      await this.saveBookingDetail(bookingId, bookingData);
      await this.saveBookingRoom(bookingId, bookingData);
      await this.setStatusRoom(bookingData);
      await this.createPayment(
        bookingId,
        bookingData,
        paymentMethod,
        paymentStatus,
      );
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

  async findAll(getBookingDto) {
    try {
      const { userId, page, per_page } = getBookingDto;

      const hotelQuery = await this.hotelRepository
        .createQueryBuilder('hotel')
        .select(['hotel.id AS id'])
        .where('hotel.ownerId = :userId', { userId: userId });

      const hotel = await hotelQuery.getRawOne();
      if (!hotel) {
        throw new Error('No hotel found for the given ownerId');
      }
      const hotelId = hotel.id;

      const bookingQuery = await this.bookingRepository
        .createQueryBuilder('booking')
        .leftJoin('booking.user', 'user')
        .leftJoin('booking.payment', 'payment')
        .select([
          'booking.id AS id',
          'user.name AS name',
          'booking.checkinTime AS "checkInDate"',
          'booking.checkoutTime AS "checkOutDate"',
          'booking.status AS status',
          'payment."totalCost" AS "totalPrice"',
        ])
        .where('booking."hotelId" = :hotelId', { hotelId: hotelId })
        .orderBy('booking.createdAt', 'DESC');

      const offset = (page - 1) * per_page;

      // Áp dụng skip và take trước khi lấy kết quả
      bookingQuery.limit(per_page).offset(offset);

      const [bookings, totalBookings] = await Promise.all([
        bookingQuery.getRawMany(),
        bookingQuery.getCount(),
      ]);
      const totalPages = Math.ceil(totalBookings / per_page);

      return {
        status_code: HttpStatus.OK,
        message: 'Booking data fetched successfully',
        data: {
          total: totalBookings,
          page: Number(page),
          total_page: totalPages,
          per_page: Number(per_page),
          bookings,
        },
      };
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

  async getDetail(viewDetailBookingDto) {
    try {
      const { userId, bookingId, page, per_page } = viewDetailBookingDto;

      const userQuery = await this.userRepository
        .createQueryBuilder('user')
        .select([
          'user.name AS name',
          'user.email AS email',
          'user.phone AS phone',
        ])
        .where('user.id = :userId', { userId: userId });

      const user = await userQuery.getRawOne();
      if (!user) {
        throw new Error('No user found for the given userId');
      }

      const bookingQuery = await this.bookingRepository
        .createQueryBuilder('booking')
        .select(['booking.note AS note'])
        .where('booking.id = :bookingId', { bookingId });
      const booking = await bookingQuery.getRawOne();
      const note = booking.note;

      const bookingRoomQuery = await this.bookingRepository
        .createQueryBuilder('booking')
        .leftJoin('booking.bookingRooms', 'booking_room')
        .leftJoin('booking.bookingDetails', 'booking_detail')
        .select([
          'booking.id AS id',
          'booking_room.room_name AS name',
          'booking_room.type AS type',
          'booking_detail.price AS price',
        ])
        .where('booking.id = :bookingId', { bookingId })
        .andWhere('booking_detail.type = booking_room.type');

      const totalBookingRoomsQuery = this.bookingRepository
        .createQueryBuilder('booking')
        .leftJoin('booking.bookingRooms', 'booking_room')
        .leftJoin('booking.bookingDetails', 'booking_detail')
        .select('COUNT(*)', 'total')
        .where('booking.id = :bookingId', { bookingId })
        .andWhere('booking_detail.type = booking_room.type');

      const offset = (page - 1) * per_page;
      bookingRoomQuery.limit(per_page).offset(offset);

      // Thực thi cả hai truy vấn
      const [bookingRooms, totalBookingRoomsResult] = await Promise.all([
        bookingRoomQuery.getRawMany(),
        totalBookingRoomsQuery.getRawOne(),
      ]);

      // Đảm bảo lấy tổng số bản ghi chính xác
      const totalBookingRooms = totalBookingRoomsResult?.total || 0;
      const totalPages = Math.ceil(totalBookingRooms / per_page);

      return {
        status_code: HttpStatus.OK,
        message: 'Booking data fetched successfully',
        data: {
          total: Number(totalBookingRooms),
          page: Number(page),
          total_page: totalPages,
          per_page: Number(per_page),
          user,
          bookingRooms,
          note,
        },
      };
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

  async updateStatusBooking(changeStatusBookingDto) {
    try {
      const { bookingId, status } = changeStatusBookingDto;
      const bookingRoomQuery = await this.bookingRoomRepository
        .createQueryBuilder('booking_room')
        .select('booking_room.roomId', 'roomId')
        .where('booking_room."bookingId" = :bookingId', { bookingId })
        .getRawMany();
      const roomIds = bookingRoomQuery.map((row) => row.roomId);
      console.log('ROOMIDS: ', roomIds);
      if (status === 'confirmed' && roomIds.length > 0) {
        await this.roomRepository
          .createQueryBuilder()
          .update()
          .set({ status: 'booked' })
          .where('id IN (:...roomIds)', { roomIds })
          .execute();
      } else if (
        (status === 'completed' || status === 'cancelled') &&
        roomIds.length > 0
      ) {
        await this.roomRepository
          .createQueryBuilder()
          .update()
          .set({ status: 'available' })
          .where('id IN (:...roomIds)', { roomIds })
          .execute();
      }

      await this.bookingRepository
        .createQueryBuilder()
        .update()
        .set({ status })
        .where('id = :bookingId', { bookingId })
        .execute();
      return {
        status_code: HttpStatus.OK,
        message: `Booking status successfully updated to ${status}.`,
      };
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

  async getAllHistoryBooking(req: Request, getAllHistoryBooking) {
    try {
      const { userId, page, per_page } = getAllHistoryBooking;
      const bookingQuery = await this.bookingRepository
        .createQueryBuilder('booking')
        .leftJoin('booking.hotel', 'hotel')
        .leftJoin('booking.payment', 'payment')
        .select([
          'booking.id AS id',
          'booking.createdAt AS created', // Thêm dấu ngoặc kép
          'hotel.name AS name',
          'payment.totalCost AS totalcost', // Thêm dấu ngoặc kép
          'booking.status AS status',
        ])
        .where('booking.userId = :userId', { userId: userId });

      const offset = (page - 1) * per_page;
      bookingQuery.limit(per_page).offset(offset);

      const [bookings, totalBookings] = await Promise.all([
        bookingQuery.getRawMany(),
        bookingQuery.getCount(),
      ]);
      const totalPages = Math.ceil(totalBookings / per_page);

      // Kiểm tra cookie 'bookingData'
      const bookingDT = req.cookies['bookingData'];
      let tempBooking = null;

      if (bookingDT) {
        const bookingData = JSON.parse(bookingDT);

        const hotelId = bookingData.hotelId;
        const hotelQuery = await this.hotelRepository
          .createQueryBuilder('hotel')
          .select(['hotel.name AS name'])
          .where('hotel.id = :hotelId', { hotelId });
        const hotel = await hotelQuery.getRawOne();

        tempBooking = {
          hotelId: hotelId,
          totalCost: bookingData.sumPrice,
          createAt: bookingData.createAt,
          hotelName: hotel.name,
          status: 'Pending',
        };
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Successfully fetched booking history.',
        data: {
          tempBooking,
          total: totalBookings,
          page: page,
          total_page: totalPages,
          bookings,
        },
      };
    } catch (error) {
      console.error('Error get history:', error);
      throw new HttpException(
        {
          status_code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Internal server error while get data.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
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

  async totalReservation(id: number) {
    try {
      const today = new Date();
      const todayDate = today.toISOString().split('T')[0];

      const count = await this.bookingRepository
        .createQueryBuilder('booking')
        .leftJoin('booking.hotel', 'hotel')
        .where('booking.hotelId = :hotelId', { hotelId: id })
        .andWhere('hotel.status = :status', { status: 'booked'})
        .andWhere('DATE(booking.checkinTime) <= :today', { today: todayDate })
        .andWhere('DATE(booking.checkoutTime) >= :today', { today: todayDate })
        .getCount();

      return {
        status: 200,
        hotelId: id,
        total: count,
      };
    } catch (error) {
      throw new Error(`Error fetching total occupied rooms: ${error.message}`);
    }
  }

  async totalcheckIn(id: number) {
    try {
      const today = new Date();
      const todayDate = today.toISOString().split('T')[0];

      const count = await this.bookingRepository
        .createQueryBuilder('booking')
        .leftJoin('booking.hotel', 'hotel')
        .where('booking.hotelId = :hotelId', { hotelId: id })
        .andWhere('hotel.status = :status', { status: 'booked'})
        .andWhere('DATE(booking.checkinTime) = :today', { today: todayDate })
        .getCount();

      return {
        status: 200,
        hotelId: id,
        total: count,
      };
    } catch (error) {
      throw new Error(`Error fetching total occupied rooms: ${error.message}`);
    }
  }

  async totalcheckOut(id: number) {
    try {
      const today = new Date();
      const todayDate = today.toISOString().split('T')[0];

      const count = await this.bookingRepository
        .createQueryBuilder('booking')
        .leftJoin('booking.hotel', 'hotel')
        .where('booking.hotelId = :hotelId', { hotelId: id })
        .andWhere('hotel.status = :status', { status: 'booked'})
        .andWhere('DATE(booking.checkoutTime) = :today', { today: todayDate })
        .getCount();

      return {
        status: 200,
        hotelId: id,
        total: count,
      };
    } catch (error) {
      throw new Error(`Error fetching total occupied rooms: ${error.message}`);
    }
  }
}
