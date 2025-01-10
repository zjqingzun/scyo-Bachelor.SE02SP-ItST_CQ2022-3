import { IsDateString, IsInt, IsEmail, IsOptional, IsString, Min, IsNumber, IsIn } from "class-validator";
import { Transform } from 'class-transformer';

export class ChangeStatusBookingDto {
    @Transform(({ value }) => parseInt(value, 10))
    @IsInt()
    bookingId: number

    @IsString() // Đảm bảo rằng status là chuỗi
    @IsIn(['confirmed', 'completed', 'cancelled'])
    status: string;
}
