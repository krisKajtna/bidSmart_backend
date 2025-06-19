import { IsNumber, Min, IsOptional, IsBoolean } from 'class-validator';

export class CreateBidDto {
    @IsNumber()
    @Min(0.01)
    amount: number;

    @IsOptional()
    @IsBoolean()
    isAutoBid?: boolean;

    @IsOptional()
    @IsNumber()
    maxAutoBidAmount?: number;
}
