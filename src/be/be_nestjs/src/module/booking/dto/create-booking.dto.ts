import { IsDateString, IsInt, IsEmail, IsOptional, IsString, Min, IsNumber } from "class-validator";
import { Transform } from 'class-transformer';

export class CreateBookingDto {
    @IsInt()
    hotelId: number;

    @IsInt()
    userId: number;

    @IsDateString()
    checkInDate?: string;

    @IsDateString()
    checkOutDate?: string;

    @Transform(({ value }) => (value !== undefined && value !== null ? parseInt(value, 10) : value))
    @IsInt()
    roomType2?: number;

    @Transform(({ value }) => (value !== undefined && value !== null ? parseInt(value, 10) : value))
    @IsInt()
    roomType4?: number;

    @IsNumber()
    @Min(0)
    type2Price: number;

    @IsNumber()
    @Min(0)
    type4Price: number;

    @IsNumber()
    @Min(0)
    sumPrice: number;
}
