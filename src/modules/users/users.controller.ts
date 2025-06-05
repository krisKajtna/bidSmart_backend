import { Body, Controller, Patch, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @UseGuards(JwtAuthGuard)
    @Patch('me/update-password')
    async updatePassword(@Req() req, @Body() dto: UpdatePasswordDto) {
        const result = await this.usersService.updatePassword(
            req.user.userId,
            dto.currentPassword,
            dto.newPassword,
        );
        return { success: result };
    }
}
