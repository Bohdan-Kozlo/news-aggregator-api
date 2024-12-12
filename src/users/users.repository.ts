import { CrudRepository } from '../common/crud.repository';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../common/prisma/prisma.service';

export class UsersRepository extends CrudRepository<Prisma.UserDelegate<any>> {
  constructor(prisma: PrismaService) {
    super(prisma, (prismaClient) => prismaClient.user);
  }

  async findByEmail(email: string) {
    return this.findOne({ where: { email } });
  }

  async updateRefreshTokens(userId: number, refreshToken: string) {
    return this.update({ where: { id: userId } }, { data: { refreshToken } });
  }

  async deleteRefreshToken(userId: number) {
    return this.update(
      { where: { id: userId } },
      { data: { refreshToken: null } },
    );
  }
}
