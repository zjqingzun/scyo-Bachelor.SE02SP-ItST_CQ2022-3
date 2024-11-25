import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthDto } from './create-auth.dto';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResetpassAuthDto extends PartialType(CreateAuthDto) {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    codeId: string;

    @IsNotEmpty()
    newPassword: string;
}
