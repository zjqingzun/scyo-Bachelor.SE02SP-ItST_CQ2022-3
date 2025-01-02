import { IsDateString, IsInt, IsOptional } from "class-validator";
import { Transform } from 'class-transformer';

export class DetailHotelDto {
    @IsDateString()
    @IsOptional()
    checkInDate?: string = new Date().toISOString().split('T')[0]; // Mặc định là hôm nay

    @IsDateString()
    @IsOptional()
    checkOutDate?: string = new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().split('T')[0]; // +2 ngày

    @Transform(({ value }) => (value ? parseInt(value, 10) : 1))
    @IsInt()
    @IsOptional()
    roomType2?: number = 1;

    @Transform(({ value }) => (value ? parseInt(value, 10) : 1))
    @IsInt()
    @IsOptional()
    roomType4?: number = 1;
}
