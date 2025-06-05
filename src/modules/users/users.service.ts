import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async findByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { email } });
    }

    async create(data: Partial<User>): Promise<User> {
        if (!data.password || !data.confirmPassword) {
            throw new BadRequestException('Password and confirmPassword are required');
        }

        if (data.password !== data.confirmPassword) {
            throw new BadRequestException('Passwords do not match');
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const user = this.userRepository.create({
            email: data.email,
            username: data.username,
            password: hashedPassword,
        });

        return this.userRepository.save(user);
    }

    async findById(id: number): Promise<User | null> {
        return this.userRepository.findOne({ where: { id: id.toString() } });
    }

    async updatePassword(userId: number, currentPassword: string, newPassword: string): Promise<boolean> {
        const user = await this.userRepository.findOne({ where: { id: userId.toString() } });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const passwordValid = await bcrypt.compare(currentPassword, user.password);
        if (!passwordValid) {
            throw new BadRequestException('Current password is incorrect');
        }

        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) {
            throw new BadRequestException('New password must be different from current password');
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;

        await this.userRepository.save(user);
        return true;
    }
}
