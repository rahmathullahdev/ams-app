import prisma from '../prisma/client';
import { Prisma } from '@prisma/client';

export class EmployeeRepository {
  async findAll(search?: string) {
    const where: Prisma.EmployeeWhereInput = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { employeeId: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
            { department: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    return prisma.employee.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        attendances: {
          orderBy: { attendanceDate: 'desc' },
        },
      },
    });
  }

  async findById(id: string) {
    return prisma.employee.findUnique({
      where: { id },
      include: {
        attendances: {
          orderBy: { attendanceDate: 'desc' },
          take: 10,
        },
      },
    });
  }

  async findByEmployeeId(employeeId: string) {
    return prisma.employee.findUnique({
      where: { employeeId },
    });
  }

  async create(data: Prisma.EmployeeCreateInput) {
    return prisma.employee.create({ data });
  }

  async update(id: string, data: Prisma.EmployeeUpdateInput) {
    return prisma.employee.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.employee.delete({
      where: { id },
    });
  }

  async count() {
    return prisma.employee.count();
  }
}

export const employeeRepository = new EmployeeRepository();
