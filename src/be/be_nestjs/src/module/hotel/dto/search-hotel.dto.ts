import { IsDateString, IsInt, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { Transform } from 'class-transformer';

export class SearchHotelDto {
    @IsString()
    @IsOptional()
    city?: string;

    @IsDateString()
    @IsOptional()
    checkInDate?: string;

    @IsDateString()
    @IsOptional()
    checkOutDate?: string;

    @Transform(({ value }) => (value ? parseInt(value, 10) : undefined))
    @IsInt()
    @IsOptional()
    roomType2?: number;

    @Transform(({ value }) => (value ? parseInt(value, 10) : undefined))
    @IsInt()
    @IsOptional()
    roomType4?: number;

    @Transform(({ value }) => (value ? parseFloat(value) : undefined))
    @IsNumber()
    @IsOptional()
    @Min(0)
    minPrice?: number; 

    @Transform(({ value }) => (value ? parseFloat(value) : undefined))
    @IsNumber()
    @IsOptional()
    @Min(0)
    maxPrice?: number;

    @Transform(({ value }) => (value ? parseFloat(value) : undefined))
    @IsNumber()
    @IsOptional()
    @Min(0)
    minRating?: number;

    @Transform(({ value }) => (value ? parseInt(value, 10) : undefined))
    @IsInt()
    @IsOptional()
    @Min(0)
    minStar?: number;
}