import { PrismaClient } from '@prisma/client';
import { NotFoundError } from '../utils/errorHandler';
const prisma = new PrismaClient();
type TimeSlotInput = {
    startTime: string;
    endTime: string;
    availableSpots: number;
  };
  
  type WorkshopInput = {
    title: string;
    description: string;
    date: string;
    maxCapacity: number;
    timeSlots: TimeSlotInput[];
  };
  

  export async function create(input: WorkshopInput) {
    return prisma.workshop.create({
      data: {
        title: input.title,
        description: input.description,
        date: new Date(input.date),
        maxCapacity: input.maxCapacity,
        timeSlots: {
          create: input.timeSlots.map((slot) => ({
            startTime: slot.startTime,
            endTime: slot.endTime,
            availableSpots: slot.availableSpots
          }))
        }
      },
      include: { timeSlots: true }
    });
  }

export async function getAll() {
  return prisma.workshop.findMany({
    where: { deleted: false },
    include: { timeSlots: true }
  });
}

export async function update(id: string, input: Partial<WorkshopInput>) {
  try {
    return await prisma.workshop.update({
      where: { id },
      data: {
        title: input.title,
        description: input.description,
        date: input.date ? new Date(input.date) : undefined,
        maxCapacity: input.maxCapacity
      }
    });
  } catch (error: any) {
    if (error.name === 'PrismaClientKnownRequestError' && error.code === 'P2025') {
      throw new NotFoundError("Workshop not found");
    }
    throw error;
  }
}

export async function softDelete(id: string) {
  try {
    return await prisma.workshop.update({
      where: { id },
      data: { deleted: true }
    });
  } catch (error: any) {
    if (error.name === 'PrismaClientKnownRequestError' && error.code === 'P2025') {
      throw new NotFoundError("Workshop not found");
    }
    throw error;
  }
}

export async function getById(id: string) {
  return prisma.workshop.findUnique({
    where: { id },
    include: {
      timeSlots: true,
    },
  });
}
