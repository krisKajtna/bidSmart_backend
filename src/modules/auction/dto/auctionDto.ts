import { IsString, IsNotEmpty, IsNumber, IsDateString, IsOptional } from 'class-validator';

export class CreateAuctionDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNumber()
    startingPrice: number;

    @IsDateString()
    startTime: string;

    @IsDateString()
    endTime: string;

    @IsOptional()
    @IsString()
    imageUrl?: string;
}


import { PartialType } from '@nestjs/mapped-types';

export class UpdateAuctionDto extends PartialType(CreateAuctionDto) { }

