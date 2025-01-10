import { Transform } from "class-transformer";
import { IsInt, IsNotEmpty } from "class-validator";

export class CreateRoomTypeDto {
    @Transform(({ value }) => (value ? parseInt(value, 10) : 0))
    @IsInt()
    @IsNotEmpty()
    doubleRoomPrice: number;

    @Transform(({ value }) => (value ? parseInt(value, 10) : 0))
    @IsInt()
    @IsNotEmpty()
    quadRoomPrice: number;
}