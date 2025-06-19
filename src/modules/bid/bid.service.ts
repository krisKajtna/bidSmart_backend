// src/bid/bid.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auction } from '../../entities/auction.entity';
import { Bid } from '../../entities/bid.entity';

@Injectable()
export class BidService {
    constructor(
        @InjectRepository(Auction)
        private auctionRepo: Repository<Auction>,
        @InjectRepository(Bid)
        private bidRepo: Repository<Bid>,
    ) { }

    async placeBid(auctionId: number, userId: number, amount: number) {
        const auction = await this.auctionRepo.findOne({
            where: { id: auctionId },
            relations: ['bids'],
        });

        if (!auction) throw new NotFoundException('Auction not found');

        const now = new Date();
        if (auction.startTime > now || auction.endTime < now) {
            throw new BadRequestException('Auction is not active');
        }

        const highestBid = (auction.bids ?? []).reduce(
            (max, bid) => (bid.amount > max ? bid.amount : max),
            +auction.startingPrice,
        );

        if (amount <= highestBid) {
            throw new BadRequestException(`Bid must be higher than ${highestBid}`);
        }

        const bid = this.bidRepo.create({
            amount,
            auction,
            bidder: { id: userId } as any,
        });

        return this.bidRepo.save(bid);
    }
}
