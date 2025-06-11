import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Req,
} from '@nestjs/common';
import { AuctionService } from './auction.service';

import { Request } from 'express';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { CreateAuctionDto, UpdateAuctionDto } from './dto/auctionDto';

@Controller('auctions')
export class AuctionController {
    constructor(private readonly auctionService: AuctionService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Body() dto: CreateAuctionDto, @Req() req: Request) {
        const user = req.user as any; // JWT payload
        return this.auctionService.create(dto, user.userId);
    }

    @Get()
    findAll() {
        return this.auctionService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.auctionService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateAuctionDto) {
        return this.auctionService.update(+id, dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.auctionService.remove(+id);
    }

    @Get('/me/auctions')
    @UseGuards(JwtAuthGuard)
    findMine(@Req() req: Request) {
        const user = req.user as any;
        return this.auctionService.findByOwner(user.userId);
    }

    @Patch('me/auction/:id')
    @UseGuards(JwtAuthGuard)
    updateMine(@Param('id') id: string, @Body() dto: UpdateAuctionDto, @Req() req: Request) {
        const user = req.user as any;
        return this.auctionService.updateOwnAuction(+id, user.userId, dto);
    }

    @Delete('me/auction/:id')
    @UseGuards(JwtAuthGuard)
    removeMine(@Param('id') id: string, @Req() req: Request) {
        const user = req.user as any;
        return this.auctionService.removeOwnAuction(+id, user.userId);
    }


}
