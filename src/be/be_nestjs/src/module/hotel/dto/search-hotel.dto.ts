import { ArrayMinSize, IsArray, IsDateString, IsInt, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { Transform } from 'class-transformer';

export class SearchHotelDto {
    @IsString()
    @IsOptional()
    city?: string;

    @Transform(({ value }) => {
        if (!value || value.trim() === '') {
            return new Date().toISOString().split('T')[0]; // Ngày hôm nay
        }
        return value;
    })
    @IsDateString()
    @IsOptional()
    checkInDate?: string;

    @Transform(({ value }) => {
        if (!value || value.trim() === '') {
            const today = new Date();
            const checkOutDate = new Date(today.setDate(today.getDate() + 2));
            return checkOutDate.toISOString().split('T')[0]; // Ngày hôm nay + 2 ngày
        }
        return value;
    })
    @IsDateString()
    @IsOptional()
    checkOutDate?: string;

    @Transform(({ value }) => (value ? parseInt(value, 10) : undefined))
    @IsInt()
    @IsOptional()
    roomType2?: number;

    @Transform(({ value }) => (value ? parseInt(value, 10) : undefined))
    @IsInt()
    @IsOptional()
    roomType4?: number;

    @Transform(({ value }) => (value ? parseFloat(value) : undefined))
    @IsNumber()
    @IsOptional()
    @Min(0)
    minPrice?: number;

    @Transform(({ value }) => (value ? parseFloat(value) : undefined))
    @IsNumber()
    @IsOptional()
    @Min(0)
    maxPrice?: number;

    @Transform(({ value }) => (value ? parseFloat(value) : undefined))
    @IsNumber()
    @IsOptional()
    @Min(0)
    minRating?: number;

    // @Transform(({ value }) => (value ? parseInt(value, 10) : undefined))
    // @IsInt()
    // @IsOptional()
    // @Min(0)
    // minStar?: number;

    @Transform(({ value }) => {
        if (!value) return [];
        if (typeof value === 'string') {
            return value.split(',').map((v: string) => parseInt(v.trim(), 10)).filter((v) => !isNaN(v));
        }
        return Array.isArray(value) ? value.map((v: any) => parseInt(v, 10)).filter((v) => !isNaN(v)) : [];
    })
    @IsArray()
    @IsInt({ each: true }) // Kiểm tra từng phần tử trong mảng có phải số nguyên hay không
    @Min(0, { each: true }) // Đảm bảo từng phần tử >= 0
    @IsOptional()
    minStar?: number[];

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