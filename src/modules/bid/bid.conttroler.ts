// src/bid/bid.controller.ts
import {
    Controller,
    Post,
    Body,
    UseGuards,
    Request,
    Get,
    Param,
    ParseIntPipe,
    Query,
} from '@nestjs/common';
import { BidService } from './bid.service';
import { CreateBidDto } from './dto/createBidDto';
import { AuthGuard } from '@nestjs/passport';

@Controller('bids')
export class BidController {
    constructor(private readonly bidService: BidService) { }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    async placeBid(@Body() createBidDto: CreateBidDto, @Request() req) {
        const userId = req.user.id;

        const {
            auctionId,
            amount,
            isAutoBid = false,
            maxAutoBidAmount,
        } = createBidDto;

        return this.bidService.placeBid(
            auctionId,
            userId,
            amount,
            isAutoBid,
            maxAutoBidAmount,
        );
    }
    @Get('history/:auctionId')
    async getBidHistory(
        @Param('auctionId', ParseIntPipe) auctionId: number,
        @Query('minutes') minutes?: string
    ) {
        const mins = parseInt(minutes || '60');
        return this.bidService.getBidHistory(auctionId, mins);
    }
}
