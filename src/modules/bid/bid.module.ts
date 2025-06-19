// src/bid/bid.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BidService } from './bid.service';
import { BidController } from './bid.conttroler';
import { Bid } from '../../entities/bid.entity';
import { Auction } from '../../entities/auction.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Bid, Auction])],
    controllers: [BidController],
    providers: [BidService],
    exports: [BidService],
})
export class BidModule { }
