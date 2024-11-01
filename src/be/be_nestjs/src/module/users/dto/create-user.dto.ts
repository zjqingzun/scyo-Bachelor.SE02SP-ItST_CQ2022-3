import { IsEmail, IsInt, IsNotEmpty, Length } from "class-validator";
import { User } from "@/module/users/entities/user.entity";
import { Expose } from "class-transformer";

export class CreateUserDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    phone: string;
}