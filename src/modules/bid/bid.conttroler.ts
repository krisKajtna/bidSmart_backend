// src/bid/bid.controller.ts
import {
    Controller,
    Post,
    Body,
    Param,
    UseGuards,
    Req,
} from '@nestjs/common';
import { BidService } from './bid.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { Request } from 'express';
import { CreateBidDto } from '../auction/dto/createBid.dto';

@Controller('auctions/:id/bid')
export class BidController {
    constructor(private readonly bidService: BidService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    async placeBid(
        @Param('id') auctionId: string,
        @Body() dto: CreateBidDto,
        @Req() req: Request,
    ) {
        const user = req.user as any;
        return this.bidService.placeBid(+auctionId, user.userId, dto.amount);
    }
}
