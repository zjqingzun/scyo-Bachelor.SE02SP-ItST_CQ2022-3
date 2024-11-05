import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthDto } from './create-auth.dto';

export class UpdateAuthDto extends PartialType(CreateAuthDto) {
    name?: string;
    email?: string;
    password?: string;
    phone?: string;
    icon?: string;
}
