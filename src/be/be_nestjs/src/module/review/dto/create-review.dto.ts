import { OmitType, PartialType } from "@nestjs/mapped-types";
import { Review } from "../entities/review.entity";
import { IsInt, IsNotEmpty } from "class-validator";
import { Transform } from "class-transformer";

export class CreateReviewDto extends OmitType(PartialType(Review), []) {
    @IsNotEmpty()
    comment: string;

    
    @Transform(({ value }) => (value ? parseInt(value, 10) : 1))
    @IsInt()
    @IsNotEmpty()
    rating: number;

    @Transform(({ value }) => (value ? parseInt(value, 10) : 1))
    @IsInt()
    @IsNotEmpty()
    userId: number;

    @Transform(({ value }) => (value ? parseInt(value, 10) : 1))
    @IsInt()
    @IsNotEmpty()
    hotelId: number;
}