// src/bid/dto/create-bid.dto.ts
import { IsNumber, IsBoolean, IsOptional, Min } from 'class-validator';

export class CreateBidDto {
    @IsNumber()
    @Min(0.01, { message: 'Bid amount must be greater than 0' })
    amount: number;

    @IsNumber()
    auctionId: number;

    @IsBoolean()
    @IsOptional()
    isAutoBid?: boolean = false;

    @IsNumber()
    @IsOptional()
    @Min(0.01, { message: 'Max auto-bid amount must be greater than 0' })
    maxAutoBidAmount?: number;
}
