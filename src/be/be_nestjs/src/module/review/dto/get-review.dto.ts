import { Transform } from 'class-transformer';
import { IsInt, IsOptional, Min, Max } from 'class-validator';

export class GetReviewDto {
  // Trường page, mặc định là 1 nếu không có giá trị
  @Transform(({ value }) => (value ? parseInt(value, 10) : 1))
  @IsInt()
  @IsOptional()
  page: number = 1;

  // Trường per_page, mặc định là 6 nếu không có giá trị
  @Transform(({ value }) => (value ? parseInt(value, 10) : 6))
  @IsInt()
  @IsOptional()
  per_page: number = 6;
}
