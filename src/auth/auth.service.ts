import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignUpUserDto } from './dto/SignUpUser.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async login(user: any) {
    const validUser = await this.validateUser(user.email, user.password);
    if (!validUser) {
      throw new UnauthorizedException('Email or Password is incorrect');
    }
    const tokens = await this.generateTokens(validUser.id, validUser.password);
    await this.usersService.updateRefreshTokens(
      validUser.id,
      validUser.refreshToken,
    );
    return tokens;
  }

  async signUp(signUpUser: SignUpUserDto) {
    const existingUser = await this.usersService.findByEmail(signUpUser.email);
    if (existingUser) {
      throw new ConflictException('Email is already in use');
    }

    const passwordHash = await bcrypt.hash(signUpUser.password, 12);

    const user = await this.usersService.create({
      ...signUpUser,
      password: passwordHash,
    });

    const tokens = await this.generateTokens(user.id, user.email);

    return { user, tokens };
  }

  async refreshTokens(userId: string) {
    const user = await this.usersService.findByEmail(userId);
    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const tokens = await this.generateTokens(+userId, user.email);
    await this.usersService.updateRefreshTokens(+userId, tokens.refreshToken);

    return tokens;
  }

  async logout(userId: string) {
    return this.usersService.deleteRefreshToken(+userId);
  }

  private async generateTokens(userId: number, email: string) {
    const payload = { userId, email };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, { expiresIn: '30m' }),
      this.jwtService.signAsync(payload, { expiresIn: '7d' }),
    ]);

    return { accessToken, refreshToken };
  }
}
