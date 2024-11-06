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


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private dataSource : DataSource
  ) {}

  async findAll(req: Request) {
    const {page = 1, limit = 5, sortBy = 'name', order = 'ASC', searchTerm} = req.query;
    const [users, total] = await this.usersRepository.findAndCount({
      relations: ['roles'],
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

  async findByEmail(email : string) {
    return await this.usersRepository.findOne({
      where: {
        email,
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

  async registerUser(createAuthDto: CreateAuthDto) {
    const {name, email, password, phone} = createAuthDto;
    const isEmailExist = await this.isEmailExist(email);
    if (isEmailExist) {
      throw new BadRequestException("email has existed");
    }
    const hashPassord = await hashPassword(password);
    const user = {
      name, email, password: hashPassord, phone,
      codeId: uuidv4(),
      codeExpired: moment().add(30, 'minute')
    };
    this.usersRepository.save(user);
    return (await user);
  }

  async update(updateUserDto: UpdateUserDto) {
    return await this.usersRepository.update({
      id: updateUserDto.id
    },
    updateUserDto)
  }

  async remove(id: number) {
    if ((await this.usersRepository.findBy({id})).length === 0) {
      throw new BadRequestException(`user with id = ${id} not existed`);
    }
    return await this.usersRepository.delete(id);
  }

}