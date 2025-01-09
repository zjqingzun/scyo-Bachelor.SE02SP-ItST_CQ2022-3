import { OmitType, PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";
import { IsNotEmpty } from "class-validator";
import { Transform } from "class-transformer";
import * as moment from "moment";

export class UpdateUserDto extends OmitType(PartialType(CreateUserDto), [
  'password',
]) {
  @IsNotEmpty()
  id: number;

  name?: string;
  email?: string;
  phone?: string;

  @Transform(({ value }) => {
    return moment(value, 'DD/MM/YYYY').toDate();
  })
  dob?: Date;

  cccd?: string;
}
