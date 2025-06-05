import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async signup(dto: SignupDto) {
        const { email, username, password, confirmPassword } = dto;

        if (password !== confirmPassword) {
            throw new Error('Gesli se ne ujemata');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await this.usersService.create({
            email,
            username,
            password: hashedPassword,
            confirmPassword: hashedPassword,
        });

        return { message: 'Uporabnik ustvarjen', user };
    }

    async login(dto: LoginDto) {
        const user = await this.usersService.findByEmail(dto.email);
        if (!user || !(await bcrypt.compare(dto.password, user.password))) {
            throw new UnauthorizedException('Napačni podatki za prijavo');
        }

        const payload = { sub: user.id, email: user.email };
        const token = await this.jwtService.signAsync(payload);

        return { accessToken: token };
    }
}
