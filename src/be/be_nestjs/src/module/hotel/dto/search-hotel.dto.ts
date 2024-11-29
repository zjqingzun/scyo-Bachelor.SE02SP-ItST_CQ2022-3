import { IsDateString, IsOptional, IsString } from "class-validator";


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
}