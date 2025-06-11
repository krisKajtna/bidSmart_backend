import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auction } from '../../entities/auction.entity';
import { AuctionService } from './auction.service';

import { AuctionController } from './auctions.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Auction])],
    controllers: [AuctionController],
    providers: [AuctionService],
})
export class AuctionModule { }
