import { Transform } from "class-transformer";
import { IsBoolean, IsInt, IsNotEmpty } from "class-validator";

export class UpdateRoomTypePriceDto {
    @Transform(({ value }) => (value ? parseInt(value, 10) : 0))
    @IsInt()
    price: number;

    @Transform(({ value }) => (value ? parseInt(value, 10) : 0))
    @IsInt()
    weekendPrice: number;

    @Transform(({ value }) => (value ? parseInt(value, 10) : 0))
    @IsInt()
    flexiblePrice: number;
    
    @IsBoolean()
    useFlexiblePrice: boolean;
}