import { IsEmail, IsInt, IsNotEmpty, Length } from "class-validator";
import { User } from "@/module/user/entities/user.entity";
import { Expose, Transform } from "class-transformer";
import * as moment from 'moment';

export class CreateUserDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @Transform(({ value }) => {
        return moment(value, "DD/MM/YYYY").toDate()})
    dob: Date;

    @IsNotEmpty()
    cccd: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    phone: string;
}