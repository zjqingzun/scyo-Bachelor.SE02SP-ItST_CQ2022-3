import { IsDateString, IsInt, IsEmail, IsOptional, IsString, Min, IsNumber } from "class-validator";
import { Transform } from 'class-transformer';

export class CreateBookingDto {
    @IsInt()
    idHotel: number;

    @IsInt()
    userId: number;

    @IsDateString()
    checkInDate?: string;

    @IsDateString()
    checkOutDate?: string;

    @Transform(({ value }) => (value ? parseInt(value, 10) : undefined))
    @IsInt()
    roomType2?: number;

    @Transform(({ value }) => (value ? parseInt(value, 10) : undefined))
    @IsInt()
    roomType4?: number;

    @IsNumber()
    @Min(0)
    sumPrice: number;
}
