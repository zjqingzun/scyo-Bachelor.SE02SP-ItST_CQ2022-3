import { OmitType, PartialType } from "@nestjs/mapped-types";
import { Hotel } from "../entities/hotel.entity";
import { IsEmail, IsEmpty, IsInt, IsNotEmpty, IsOptional } from "class-validator";
import { Transform } from "class-transformer";

export class CreateHotelDto extends OmitType(PartialType(Hotel), []) {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    description: string;

    @IsNotEmpty()
    detailAddress: string;

    @IsNotEmpty()
    city: string;

    @IsNotEmpty()
    district: string;

    @IsNotEmpty()
    ward: string;

    @IsNotEmpty()
    phone: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @Transform(({ value }) => (value ? parseInt(value, 10) : 6))
    @IsInt()
    @IsNotEmpty()
    star: number;
}
