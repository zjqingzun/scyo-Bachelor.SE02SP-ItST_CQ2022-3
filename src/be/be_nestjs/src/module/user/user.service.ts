import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { hashPassword } from '@/helpers/utils';
import { query, Request } from 'express';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateAuthDto } from '@/auth/dto/create-auth.dto';
import { v4 as uuidv4 } from 'uuid';
import * as moment from 'moment';
import { MinioService } from '@/minio/minio.service';
import { ResetpassAuthDto } from '@/auth/dto/resetpassword-auth.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private dataSource: DataSource,
    private readonly minioService: MinioService,
  ) {}

  async findAll(role: string, req: Request) {
    const {page = 1, limit = 5, sortBy = 'id', order = 'ASC', searchTerm} = req.query;
    const queryBuilder = this.usersRepository.createQueryBuilder('user')
        .select([
            'user.id',
            'user.name',
            'user.email',
            'user.phone',
            'user.dob',
            'user.cccd'
        ])
        .innerJoin('users_roles', 'ur', 'ur."userId" = user.id')
        .innerJoin('role', 'r', 'ur."roleId" = r.id')
        .where('r.name = :role', { role });

    queryBuilder.orderBy(`user.${sortBy}`, order === 'ASC' ? 'ASC' : 'DESC');

    const [users, total] = await queryBuilder
        .take(+limit)
        .skip((+page - 1) * +limit)
        .getManyAndCount();
    return {
      page: page,
      per_page: limit,
      total,
      total_pages: Math.ceil(total / +limit),
      users
    };
  }

  findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  async findAllFav(req: Request) {
    const {
      page = 1,
      limit = 5,
      sortBy = 'name',
      order = 'ASC',
      userId = 1,
    } = req.query;
    const queryRunner = this.dataSource.createQueryRunner();
    const take = limit as number;
    const skip = ((page as number) - 1) * (limit as number);

    const allFavHotel = await queryRunner.query(`
      SELECT count(*)
      FROM hotel
      WHERE id IN (
        SELECT "hotelId"
        FROM "user_favouriteHotel"
        WHERE "userId" = ${userId}
      )
    `);
    const allPage = parseInt(allFavHotel[0].count);

    let allFavHotelPaging = await queryRunner.query(`
      SELECT 
        h.*, 
        MIN(rt.price) AS price,
        json_agg(i.url) AS images
      FROM hotel h
      JOIN "user_favouriteHotel" uf ON uf."hotelId" = h.id
      LEFT JOIN room_type rt ON rt."hotelId" = h.id
      LEFT JOIN image i ON i."hotelId" = h.id
      WHERE uf."userId" = $1
      GROUP BY h.id
      ORDER BY ${sortBy} ${order}
      LIMIT $2 OFFSET $3
    `, [userId, take, skip]);
    await queryRunner.release();
    allFavHotelPaging = allFavHotelPaging.map(hotel => ({
      ...hotel,
      isFav: true
    }));
    return {
      status: 200,
      message: 'Successfully',
      data: {
        all_page: Math.ceil(allPage / take),
        total: allPage,
        hotels: allFavHotelPaging,
      },
    };
  }

  async findByEmail(email: string) {
    return await this.usersRepository.findOne({
      where: {
        email,
      },
    });
  }

  async findById(id: number) {
    return await this.usersRepository.findOne({
      where: {
        id,
      },
    });
  }

  async isEmailExist(email: string) {
    let isExist = await this.usersRepository.findBy({ email });
    if (isExist.length !== 0) {
      return true;
    }
    return false;
  }

  async create(createUserDto: CreateUserDto) {
    const { name, email, password, phone } = createUserDto;
    const isEmailExist = await this.isEmailExist(email);
    if (isEmailExist) {
      throw new BadRequestException('email has existed');
    }
    const hashPassord = await hashPassword(password);
    const user = this.usersRepository.save({
      name,
      email,
      password: hashPassord,
      phone,
    });
    return (await user).id;
  }

  async createUsers(createUserDto: CreateUserDto[]) {
    // await this.dataSource.transaction(async manager => {
    //   userDto.forEach(async u => {
    //     await manager.save(u);
    //   });
    // })

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      createUserDto.forEach(async (u) => {
        await queryRunner.manager.save(u);
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error('Transaction error!');
    } finally {
      await queryRunner.release();
    }
  }

  async registerUser(createAuthDto: CreateAuthDto, role: string) {
    const { name, dob, cccd, email, password, phone } = createAuthDto;
    const isEmailExist = await this.isEmailExist(email);
    if (isEmailExist) {
      throw new BadRequestException('email has existed');
    }
    const hashPassord = await hashPassword(password);
    const user = {
      name,
      dob,
      cccd,
      email,
      password: hashPassord,
      phone,
      codeId: uuidv4(),
      codeExpired: moment().add(30, 'minute'),
    };
    const userSaved = await this.usersRepository.save(user);
    await this.setRole(userSaved.id, role);
    return user;
  }

  async setupResetPassword(email: string) {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new BadRequestException('Email has not existed!');
    }
    user.codeId = uuidv4();
    user.codeExpired = moment().add(5, 'minute').toDate();
    await this.updateUser(user);
    return user;
  }

  async resetPassword(resetInfo: ResetpassAuthDto) {
    const user = await this.findByEmail(resetInfo.email);
    if (!user) {
      throw new BadRequestException('Email has not existed!');
    }
    if (user.codeId === resetInfo.codeId) {
      if (moment().isBefore(user.codeExpired)) {
        user.password = await hashPassword(resetInfo.newPassword);
        await this.updateUser(user);
        return 'Reset password successfully!';
      } else {
        throw new BadRequestException('The reset code has expired!');
      }
    } else {
      throw new BadRequestException('Invalid reset code!');
    }
  }

  async update(updateUserDto: UpdateUserDto) {
    return await this.usersRepository.update(
      {
        id: updateUserDto.id,
      },
      updateUserDto,
    );
  }

  async updateUser(user: User) {
    return await this.usersRepository.update(
      {
        id: user.id,
      },
      user,
    );
  }

  async uploadAvatar(file: Express.Multer.File, email: string) {
    const bucketName = 'bookastay';
    const user = await this.findByEmail(email);
    if (!user) {
      throw new BadRequestException('User not existed');
    }
    const fileName =
      user.name.split(' ').pop() + '.' + file.originalname.split('.').pop();
    await this.minioService.uploadFile(
      bucketName,
      `user_avatar/${fileName}`,
      file.buffer,
    );
    await this.usersRepository.update(
      {
        id: user.id,
      },
      {
        avatar: fileName,
      },
    );
  }

  async getAvatarUrl(email: string) {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new BadRequestException('User not existed');
    }
    const objectName = `user_avatar/${user.avatar}`;
    try {
      const url = await this.minioService.getPresignedUrl(objectName);
      return { url };
    } catch (error) {
      return { message: 'Failed to retrieve image URL', error };
    }
  }

  async remove(id: number) {
    if ((await this.usersRepository.findBy({ id })).length === 0) {
      throw new BadRequestException(`user with id = ${id} not existed`);
    }
    const res = await this.usersRepository.delete(id);
    if (res.affected > 0) {
      return {
        status: 200,
        message: "Delete user successfully"
      };
    }
  }

  async setRole(userId: number, role: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    const roleId = await queryRunner.manager.query(
      `SELECT id FROM role WHERE name = '${role}'`,
    );

    await queryRunner.manager.query(
      `INSERT INTO users_roles("userId", "roleId") VALUES(${userId}, ${roleId[0].id})`,
    );
    await queryRunner.release();
  }

  async getRole(userId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    const role = await queryRunner.manager.query(`
      SELECT r.name
      FROM (
            SELECT *
            FROM users_roles
            WHERE "userId" = ${userId}
          ) ur JOIN role r ON ur."roleId" = r.id
    `);
    await queryRunner.release();
    return role[0].name;
  }

  async addFav(req: Request) {
    const { userId, hotelId } = req.query;
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.startTransaction();

      const isExisted = await queryRunner.manager.query(
        `
        SELECT *
        FROM "user_favouriteHotel"
        WHERE "userId" = $1 AND "hotelId" = $2
      `,
        [userId, hotelId],
      );

      if (isExisted.length > 0) {
        throw new BadRequestException('Fav hotel has existed');
      }

      const inserted = await queryRunner.manager.query(
        `
        INSERT INTO "user_favouriteHotel"("userId", "hotelId")
        VALUES ($1, $2)
      `,
        [userId, hotelId],
      );

      await queryRunner.commitTransaction();

      return {
        message: 'Successfully',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async deleteFav(req: Request) {
    try {
      const { userId, hotelId } = req.query;
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.query(`
        DELETE FROM "user_favouriteHotel"
        WHERE "userId" = ${userId} AND "hotelId" = ${hotelId}
      `);
      await queryRunner.release();
      return {
        status: 200,
        message: 'Successfully',
      };
    } catch (error) {
      console.error('Error deleting favourite hotel:', error);
      throw new HttpException(
        {
          status_code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Internal server error. Please try again later.',
          error: error.message || 'Unknown error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async dashboardForHotelier(hotelierId: number) {
    const hotelier = await this.usersRepository.findBy({
      id: hotelierId,
    });
    const dateNow = moment().toLocaleString();

    return hotelier;
  }

  async totalUsers() {
    const roles = ['user']; 

    const queryBuilder = this.usersRepository.createQueryBuilder('user')
        .innerJoin('users_roles', 'ur', 'ur."userId" = user.id')
        .innerJoin('role', 'r', 'ur."roleId" = r.id')
        .where('r.name IN (:...roles)', { roles });

    const total = await queryBuilder.getCount();

    return {
        status: 200,
        totalUsers: total 
    };
  }

  async totalHotels() {
    const roles = ['hotelier']; 

    const queryBuilder = this.usersRepository.createQueryBuilder('user')
        .innerJoin('users_roles', 'ur', 'ur."userId" = user.id')
        .innerJoin('role', 'r', 'ur."roleId" = r.id')
        .where('r.name IN (:...roles)', { roles });

    const total = await queryBuilder.getCount();

    return {
        status: 200,
        totalHotels: total 
    };
  }

}
