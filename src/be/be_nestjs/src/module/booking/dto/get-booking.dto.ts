import { IsDateString, IsInt, IsEmail, IsOptional, IsString, Min, IsNumber } from "class-validator";
import { Transform } from 'class-transformer';

export class GetBookingDto {
    @Transform(({ value }) => parseInt(value, 10))
    @IsInt()
    userId: number

    @Transform(({ value }) => (value ? parseInt(value, 10) : 1))
    @IsInt()
    @IsOptional()
    page: number = 1;

    // Trường per_page, mặc định là 6 nếu không có giá trị
    @Transform(({ value }) => (value ? parseInt(value, 10) : 6))
    @IsInt()
    @IsOptional()
    per_page: number = 6;
}
