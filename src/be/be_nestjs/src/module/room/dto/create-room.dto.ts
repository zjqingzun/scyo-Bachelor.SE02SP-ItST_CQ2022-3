import { Transform } from "class-transformer";
import { IsInt, IsNotEmpty } from "class-validator";

export class CreateRoomDto {
    @IsNotEmpty()
    name: string;

    @Transform(({ value }) => (value ? parseInt(value, 10) : 1))
    @IsInt()
    @IsNotEmpty()
    type: number;
}
