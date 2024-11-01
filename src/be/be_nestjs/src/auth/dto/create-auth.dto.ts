import { isNotEmpty, IsNotEmpty } from "class-validator";

export class CreateAuthDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    phone: string;
}
