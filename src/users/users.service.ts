import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { SignUpUserDto } from '../auth/dto/SignUpUser.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async findByEmail(email: string) {
    return this.prismaService.user.findUnique({
      where: { email },
    });
  }

  async create(signUpUser: SignUpUserDto) {
    return this.prismaService.user.create({ data: signUpUser });
  }

  async findById(id: number) {
    return this.prismaService.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async updateUser(userId: number, updateProfileDto: UpdateProfileDto) {
    console.log(updateProfileDto);
    if (updateProfileDto?.password) {
      return this.prismaService.user.update({
        where: { id: userId },
        data: {
          ...updateProfileDto,
          password: await bcrypt.hash(updateProfileDto.password, 12),
        },
      });
    }

    return this.prismaService.user.update({
      where: { id: userId },
      data: updateProfileDto,
    });
  }
}
