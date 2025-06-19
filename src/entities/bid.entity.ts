// src/entities/bid.entity.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
} from 'typeorm';
import { Auction } from './auction.entity';
import { User } from './user.entity';

@Entity()
export class Bid {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    amount: number;

    @ManyToOne(() => User, { eager: true })
    bidder: User;

    @ManyToOne(() => Auction, (auction) => auction.bids, { onDelete: 'CASCADE' })
    auction: Auction;

    @CreateDateColumn()
    createdAt: Date;
}
