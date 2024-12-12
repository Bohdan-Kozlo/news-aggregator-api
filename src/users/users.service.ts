import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { SignUpUserDto } from '../auth/dto/SignUpUser.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async findByEmail(email: string) {
    return this.prismaService.user.findUnique({ where: { email } });
  }

  async create(signUpUser: SignUpUserDto) {
    return this.prismaService.user.create({ data: signUpUser });
  }

  async findById(id: number) {
    return this.prismaService.user.findUnique({ where: { id } });
  }

  async updateRefreshTokens(userId: number, refreshToken: string) {
    return this.prismaService.user.update({
      where: { id: +userId },
      data: { refreshToken: refreshToken },
    });
  }

  async deleteRefreshToken(userId: number) {
    return this.prismaService.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }
}
