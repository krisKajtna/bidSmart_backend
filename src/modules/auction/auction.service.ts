import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auction } from '../../entities/auction.entity';
import { CreateAuctionDto, UpdateAuctionDto } from './dto/auctionDto';

@Injectable()
export class AuctionsService {
    constructor(
        @InjectRepository(Auction)
        private readonly auctionRepo: Repository<Auction>,
    ) { }

    create(dto: CreateAuctionDto, userId: number) {
        const auction = this.auctionRepo.create({ ...dto, ownerId: userId });
        return this.auctionRepo.save(auction);
    }

    findAll() {
        return this.auctionRepo.find();
    }

    async findOne(id: number) {
        const auction = await this.auctionRepo.findOne({ where: { id } });
        if (!auction) throw new NotFoundException('Auction not found');
        return auction;
    }

    async update(id: number, dto: UpdateAuctionDto) {
        await this.auctionRepo.update(id, dto);
        return this.findOne(id);
    }

    async remove(id: number) {
        const auction = await this.findOne(id);
        return this.auctionRepo.remove(auction);
    }
}
