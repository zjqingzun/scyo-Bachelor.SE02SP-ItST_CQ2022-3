import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthDto } from './create-auth.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateAuthDto extends PartialType(CreateAuthDto) {
    @IsNotEmpty()
    codeId: string;

    @IsNotEmpty()
    newPassword: string;
}
