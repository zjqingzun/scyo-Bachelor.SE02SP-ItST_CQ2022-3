import { IsString, IsNumber, IsOptional } from 'class-validator';

export class PaymentCallbackDto {
  @IsOptional()
  @IsString()
  orderId?: string;

  @IsOptional()
  @IsString()
  partnerCode?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  message?: string; 

  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsString()
  signature?: string;
}
