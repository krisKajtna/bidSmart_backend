import {
    Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request
} from '@nestjs/common';
import { AuctionsService } from './auction.service';
import { CreateAuctionDto, UpdateAuctionDto } from './dto/auctionDto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('auctions')
export class AuctionsController {
    constructor(private readonly service: AuctionsService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Body() dto: CreateAuctionDto, @Request() req) {
        return this.service.create(dto, req.user.id);
    }

    @Get()
    findAll() {
        return this.service.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.service.findOne(+id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    update(@Param('id') id: string, @Body() dto: UpdateAuctionDto) {
        return this.service.update(+id, dto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    remove(@Param('id') id: string) {
        return this.service.remove(+id);
    }
}
