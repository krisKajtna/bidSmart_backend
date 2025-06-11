import {
    IsString,
    IsNotEmpty,
    IsNumber,
    Min,
    IsDateString,
    Validate,
} from 'class-validator';

import { PartialType } from '@nestjs/mapped-types';
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


export class UpdateAuctionDto extends PartialType(CreateAuctionDto) { }

