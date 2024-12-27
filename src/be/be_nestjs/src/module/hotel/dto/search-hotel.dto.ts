import { IsDateString, IsNumber, IsOptional, IsString } from "class-validator";
import internal from "stream";


export class SearchHotelDto {
    @IsString()
    @IsOptional() // Có thể có trường này hoặc không có 
    city?: string;

    @IsDateString()
    @IsOptional()
    checkInDate?: string;

    @IsDateString()
    @IsOptional()
    checkOutDate?: string;

    @IsNumber()
    @IsOptional()
    roomType2?: number;

    @IsNumber()
    @IsOptional()
    roomType4?: number;
}