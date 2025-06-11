import {
    IsString,
    IsNotEmpty,
    IsNumber,
    Min,
    IsDateString,
    Validate,
} from 'class-validator';

import { IsEndTimeAfterStartTime } from './validators/endTimeAfterStartTime.validator';

export class CreateAuctionDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNumber()
    @Min(0)
    startingPrice: number;

    @IsDateString()
    startTime: string;

    @IsDateString()
    @Validate(IsEndTimeAfterStartTime, ['startTime'])
    endTime: string;
}

import { IsOptional } from 'class-validator';

export class UpdateAuctionDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    startingPrice?: number;

    @IsOptional()
    @IsDateString()
    startTime?: string;

    @IsOptional()
    @IsDateString()
    endTime?: string;

    @IsOptional()
    @IsString()
    imageUrl?: string;
}

