import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Bid } from './bid.entity';

@Entity()
export class Auction {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column('text')
    description: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    startingPrice: number;

    @Column({ type: 'timestamp' })
    startTime: Date;

    @Column({ type: 'timestamp' })
    endTime: Date;

    @Column({ nullable: true })
    imageUrl: string;

    @ManyToOne(() => User, (user) => user.auctions, { eager: true })
    owner: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Bid, (bid) => bid.auction)
    bids: Bid[];

}
