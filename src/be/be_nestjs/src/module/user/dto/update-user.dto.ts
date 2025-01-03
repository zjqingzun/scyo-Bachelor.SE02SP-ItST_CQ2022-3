import { OmitType, PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";
import { IsNotEmpty } from "class-validator";

export class UpdateUserDto extends OmitType(PartialType(CreateUserDto), ["password"]) {
    @IsNotEmpty()
    id: number;

    name?: string;
    email?: string;
    phone?: string;
    dob?: Date;
}