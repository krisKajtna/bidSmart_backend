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

    async placeBid(auctionId: number, userId: number, amount: number, isAutoBid = false, maxAutoBidAmount?: number) {
        const auction = await this.auctionRepo.findOne({
            where: { id: auctionId },
            relations: ['bids'],
        });

        if (!auction) throw new NotFoundException('Auction not found');

        const now = new Date();
        if (auction.startTime > now || auction.endTime < now) {
            throw new BadRequestException('Auction is not active');
        }

        const highestBid = auction.bids.reduce((max, bid) =>
            bid.amount > max ? bid.amount : max,
            +auction.startingPrice
        );

        if (amount <= highestBid) {
            throw new BadRequestException(`Bid must be higher than ${highestBid}`);
        }

        const bid = this.bidRepo.create({
            amount,
            auction,
            bidder: { id: userId } as any,
            isAutoBid,
            maxAutoBidAmount: isAutoBid ? maxAutoBidAmount : undefined,
        });

        const savedBid = await this.bidRepo.save(bid);

        // Po oddaji preverimo druge auto-bid uporabnike
        await this.handleAutoBids(auctionId, userId);

        return savedBid;
    }

    private async handleAutoBids(auctionId: number, lastUserId: number) {
        const auction = await this.auctionRepo.findOne({
            where: { id: auctionId },
            relations: ['bids', 'bids.bidder'],
        });

        if (!auction) return;

        const highestBid = auction.bids.reduce(
            (max, bid) => bid.amount > max ? bid.amount : max,
            +auction.startingPrice
        );

        const autoBidders: Bid[] = auction.bids
            .filter(bid => bid.isAutoBid && Number(bid.bidder.id) !== lastUserId)
            .reduce<Bid[]>((acc, bid) => {
                const existing = acc.find(a => a.bidder.id === bid.bidder.id);
                if (!existing || (bid.maxAutoBidAmount ?? 0) > (existing.maxAutoBidAmount ?? 0)) {
                    return [...acc.filter(a => a.bidder.id !== bid.bidder.id), bid];
                }
                return acc;
            }, []);

        for (const autoBid of autoBidders) {
            const nextAmount = highestBid + 1;
            if (nextAmount <= (autoBid.maxAutoBidAmount ?? 0)) {
                const exists = await this.bidRepo.findOne({
                    where: {
                        auction: { id: auctionId },
                        bidder: { id: autoBid.bidder.id },
                        amount: nextAmount,
                    },
                });

                if (!exists) {
                    const bid = this.bidRepo.create({
                        amount: nextAmount,
                        auction,
                        bidder: { id: autoBid.bidder.id } as any,
                        isAutoBid: true,
                        maxAutoBidAmount: autoBid.maxAutoBidAmount,
                    });

                    await this.bidRepo.save(bid);
                    await this.handleAutoBids(auctionId, Number(autoBid.bidder.id));
                    break;
                }
            }
        }
    }


}
