// src/bid/bid.service.ts
import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
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

    async placeBid(
        auctionId: number,
        userId: number,
        amount: number,
        isAutoBid = false,
        maxAutoBidAmount?: number,
    ): Promise<Bid> {
        const auction = await this.auctionRepo.findOne({
            where: { id: auctionId },
            relations: ['bids'],
        });

        if (!auction) {
            throw new NotFoundException('Auction not found');
        }

        const now = new Date();
        if (auction.startTime > now || auction.endTime < now) {
            throw new BadRequestException('Auction is not active');
        }

        const highestBid = auction.bids.reduce(
            (max, bid) => (bid.amount > max ? bid.amount : max),
            +auction.startingPrice,
        );

        if (amount <= highestBid) {
            throw new BadRequestException(
                `Bid must be higher than current highest bid: ${highestBid}`,
            );
        }

        const bid = this.bidRepo.create({
            amount,
            auction,
            bidder: { id: userId } as any,
            isAutoBid,
            maxAutoBidAmount: isAutoBid ? maxAutoBidAmount : undefined,
        });

        const savedBid = await this.bidRepo.save(bid);

        await this.handleAutoBids(auctionId, userId);

        return savedBid;
    }

    private async handleAutoBids(
        auctionId: number,
        lastUserId: number,
    ): Promise<void> {
        const auction = await this.auctionRepo.findOne({
            where: { id: auctionId },
            relations: ['bids', 'bids.bidder'],
        });

        if (!auction) return;

        const highestBid = auction.bids.reduce(
            (max, bid) => (bid.amount > max ? bid.amount : max),
            +auction.startingPrice,
        );

        // Shrani najvišjo maxAutoBid za vsakega uporabnika
        const autoBidderMap = new Map<number, Bid>();

        for (const bid of auction.bids) {
            if (!bid.isAutoBid || Number(bid.bidder.id) === lastUserId) continue;

            const existing = autoBidderMap.get(Number(bid.bidder.id));
            if (
                !existing ||
                (bid.maxAutoBidAmount ?? 0) > (existing.maxAutoBidAmount ?? 0)
            ) {
                autoBidderMap.set(Number(bid.bidder.id), bid);
            }
        }

        for (const [bidderId, autoBid] of autoBidderMap.entries()) {
            const nextAmount = highestBid + 1;
            const maxAuto = +(autoBid.maxAutoBidAmount ?? 0);

            if (nextAmount > maxAuto) continue;

            const exists = await this.bidRepo.findOne({
                where: {
                    auction: { id: auctionId },
                    bidder: { id: String(bidderId) },
                    amount: nextAmount,
                },
            });

            if (!exists) {
                const bid = this.bidRepo.create({
                    amount: nextAmount,
                    auction,
                    bidder: { id: bidderId } as any,
                    isAutoBid: true,
                    maxAutoBidAmount: autoBid.maxAutoBidAmount,
                });

                await this.bidRepo.save(bid);

                // Rekurzivno preverimo nove avtomatske odgovore
                await this.handleAutoBids(auctionId, bidderId);
                break; // Ena avtomatska ponovitev naenkrat
            }
        }
    }
}
