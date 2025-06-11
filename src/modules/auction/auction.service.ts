import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auction } from '../../entities/auction.entity';
import { CreateAuctionDto, UpdateAuctionDto } from './dto/auctionDto';


@Injectable()
export class AuctionService {
    constructor(
        @InjectRepository(Auction)
        private readonly auctionRepo: Repository<Auction>,
    ) { }

    async create(dto: CreateAuctionDto, userId: number) {
        const auction = this.auctionRepo.create({
            ...dto,
            owner: { id: userId } as any, // ključni del
        });
        return this.auctionRepo.save(auction);
    }

    findAll() {
        return this.auctionRepo.find();
    }

    findOne(id: number) {
        return this.auctionRepo.findOne({ where: { id } });
    }

    async update(id: number, dto: UpdateAuctionDto) {
        await this.auctionRepo.update(id, dto);
        return this.findOne(id);
    }

    async remove(id: number) {
        await this.auctionRepo.delete(id);
        return { deleted: true };
    }

    async findByOwner(ownerId: number) {
        return this.auctionRepo.find({
            where: { owner: { id: ownerId.toString() } },
            order: { createdAt: 'DESC' },
        });
    }

}
