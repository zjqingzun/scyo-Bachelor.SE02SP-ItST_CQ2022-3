import { OmitType, PartialType } from "@nestjs/mapped-types";
import { Booking } from "../entities/booking.entity";
import { IsDateString, IsInt, IsNotEmpty, IsOptional } from "class-validator";
import { Transform } from "class-transformer";

export class CreateBookingDto extends OmitType(PartialType(Booking), []) {
    @Transform(({ value }) => (value ? parseInt(value, 10) : 1))
    @IsInt()
    @IsNotEmpty()
    userId: number;

    @Transform(({ value }) => (value ? parseInt(value, 10) : 1))
    @IsInt()
    @IsNotEmpty()
    hotelId: number;

    @IsDateString()
    @IsNotEmpty()
    checkinTime: string;

    @IsDateString()
    @IsNotEmpty()
    checkoutTime: string;

    @IsOptional()
    note: string;
}
