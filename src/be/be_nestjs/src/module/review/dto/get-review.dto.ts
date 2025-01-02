import { IsInt, IsOptional, Min, Max } from 'class-validator';

export class GetReviewDto {
  @IsInt()
  @IsOptional()
  @Min(1)
  page: number = 1;

  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(100)
  limit: number = 10;
}
