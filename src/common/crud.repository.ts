import { PrismaClient } from '@prisma/client';

export class CrudRepository<T> {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly model: (prisma: PrismaClient) => T,
  ) {}

  get repository() {
    return this.model(this.prisma) as unknown as T;
  }

  async create(data: any): Promise<any> {
    return (this.repository as any).create({ data });
  }

  async findAll(params?: any): Promise<any[]> {
    return (this.repository as any).findMany(params);
  }

  async findOne(where: any): Promise<any> {
    return (this.repository as any).findUnique({ where });
  }

  async update(where: any, data: any): Promise<any> {
    return (this.repository as any).update({ where, data });
  }

  async delete(where: any): Promise<any> {
    return (this.repository as any).delete({ where });
  }
}
