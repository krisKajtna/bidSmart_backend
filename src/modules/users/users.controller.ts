import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async getMe(@Req() req) {
        const user = await this.usersService.findById(req.user.userId);
        if (!user) {
            return null;
        }
        const { password, ...result } = user;
        return result;
    }
}
