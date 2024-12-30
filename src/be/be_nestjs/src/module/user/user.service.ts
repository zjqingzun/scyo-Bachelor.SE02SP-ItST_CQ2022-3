import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { hashPassword } from "@/helpers/utils";
import { Request } from "express";
import { UpdateUserDto } from "./dto/update-user.dto";
import { CreateAuthDto } from "@/auth/dto/create-auth.dto";
import { v4 as uuidv4 } from 'uuid';
import * as moment from "moment";
import { MinioService } from "@/minio/minio.service";
import { ResetpassAuthDto } from "@/auth/dto/resetpassword-auth.dto";


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private dataSource : DataSource,
    private readonly minioService : MinioService
  ) {}

  async findAll(req: Request) {
    const {page = 1, limit = 5, sortBy = 'name', order = 'ASC', searchTerm} = req.query;
    const [users, total] = await this.usersRepository.findAndCount({
      select: {
        name: true,
        email: true,
        phone: true,
      },
      order: {
        [sortBy as string]: order,
      },
      take: limit as number,
      skip: (page as number - 1) * (limit as number),
    });
    return {users, total};
  }

  findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  async findAllFav(req : Request) {
    const {page = 1, limit = 5, sortBy = 'name', order = 'ASC', userId = 1} = req.query;
    const queryRunner = this.dataSource.createQueryRunner();
    const take = limit;
    const skip = (page as number - 1) * (limit as number);
    let allFavHotel = await queryRunner.query(`
      SELECT *
      FROM hotel
      WHERE id IN (
        SELECT "hotelId"
        FROM "user_favouriteHotel"
        WHERE "userId" = ${userId}
      )
      ORDER BY ${sortBy} ${order}
      LIMIT ${take} OFFSET ${skip}
    `);
    return allFavHotel;
  }

  async findByEmail(email : string) {
    return await this.usersRepository.findOne({
      where: {
        email,
      }
    });
  }

  async findById(id : number) {
    return await this.usersRepository.findOne({
      where: {
        id,
      }
    });
  }

  async isEmailExist(email : string) {
    let isExist = await this.usersRepository.findBy({email});
    if (isExist.length !== 0) {
      return true;
    }
    return false;
  }

  async create(createUserDto : CreateUserDto) {
    const {name, email, password, phone} = createUserDto;
    const isEmailExist = await this.isEmailExist(email);
    if (isEmailExist) {
      throw new BadRequestException("email has existed");
    }
    const hashPassord = await hashPassword(password);
    const user = this.usersRepository.save({name, email, password: hashPassord, phone});
    return (await user).id;
  }

  async createUsers(createUserDto : CreateUserDto[]) {

    // await this.dataSource.transaction(async manager => {
    //   userDto.forEach(async u => {
    //     await manager.save(u);
    //   });
    // })

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      createUserDto.forEach(async u => {
        await queryRunner.manager.save(u);
      })
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error("Transaction error!");
    } finally {
      await queryRunner.release();
    }
  }

  async registerUser(createAuthDto: CreateAuthDto, role : string) {
    const {name, dob, cccd, email, password, phone} = createAuthDto;
    const isEmailExist = await this.isEmailExist(email);
    if (isEmailExist) {
      throw new BadRequestException("email has existed");
    }
    const hashPassord = await hashPassword(password);
    const user = {
      name, dob, cccd, email, password: hashPassord, phone,
      codeId: uuidv4(),
      codeExpired: moment().add(30, 'minute')
    };
    const userSaved = await this.usersRepository.save(user);
    await this.setRole(userSaved.id, role);
    return (user);
  }

  async setupResetPassword(email : string) {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new BadRequestException("Email has not existed!");
    }
    user.codeId = uuidv4();
    user.codeExpired = moment().add(5, 'minute').toDate();
    await this.updateUser(user);
    return user;
  }

  async resetPassword(resetInfo : ResetpassAuthDto) {
    const user = await this.findByEmail(resetInfo.email);
    if (!user) {
      throw new BadRequestException("Email has not existed!");
    }
    if (user.codeId === resetInfo.codeId) {
      if (moment().isBefore(user.codeExpired)) {
        user.password = await hashPassword(resetInfo.newPassword);
        await this.updateUser(user);
        return "Reset password successfully!";
      } else {
        throw new BadRequestException("The reset code has expired!");
      }
    } else {
      throw new BadRequestException("Invalid reset code!");
    }
  }

  async update(updateUserDto: UpdateUserDto) {
    return await this.usersRepository.update({
      id: updateUserDto.id
    },
    updateUserDto);
  }

  async updateUser(user : User) {
    return await this.usersRepository.update({
      id: user.id
    },
    user);
  }

  async uploadAvatar(file: Express.Multer.File, email: string) {
    const bucketName = 'bookastay';
    const user = await this.findByEmail(email);
    if (!user) {
      throw new BadRequestException('User not existed');
    }
    const fileName = user.name.split(' ').pop() + '.' + file.originalname.split('.').pop();
    await this.minioService.uploadFile(bucketName, `user_avatar/${fileName}`, file.buffer);
    await this.usersRepository.update({
      id: user.id
    },
    {
      'avatar': fileName
    })
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
    if ((await this.usersRepository.findBy({id})).length === 0) {
      throw new BadRequestException(`user with id = ${id} not existed`);
    }
    return await this.usersRepository.delete(id);
  }

  async setRole(userId: number, role : string) {
    const queryRunner = this.dataSource.createQueryRunner();
    const roleObj = await queryRunner.manager.query(`SELECT * FROM role WHERE name = '${role}'`);
    await queryRunner.manager.query(`INSERT INTO users_roles("userId", "roleId") VALUES(${userId}, ${roleObj[0].id})`);
  }

  async addFav(req : Request) {
    const {userId, hotelId} = req.query;
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.startTransaction();
    
      const isExisted = await queryRunner.manager.query(`
        SELECT *
        FROM "user_favouriteHotel"
        WHERE "userId" = $1 AND "hotelId" = $2
      `, [userId, hotelId]);
    
      if (isExisted.length > 0) {
        throw new BadRequestException("Fav hotel has existed");
      }
    
      const inserted = await queryRunner.manager.query(`
        INSERT INTO "user_favouriteHotel"("userId", "hotelId")
        VALUES ($1, $2)
      `, [userId, hotelId]);
      
      await queryRunner.commitTransaction();

      return {
        message: "Successfully"
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}