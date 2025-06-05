import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateAuctionDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsString()
    description?: string;

    @IsNumber()
    @Min(0)
    startingPrice: number;
}

export class UpdateAuctionDto extends PartialType(CreateAuctionDto) { }
