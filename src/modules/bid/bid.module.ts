// src/bid/bid.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bid } from '../../entities/bid.entity';
import { Auction } from '../../entities/auction.entity';
import { BidService } from './bid.service';
import { BidController } from './bid.conttroler';

@Module({
    imports: [TypeOrmModule.forFeature([Bid, Auction])],
    providers: [BidService],
    controllers: [BidController],
})
export class BidModule { }
