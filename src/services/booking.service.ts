import { PrismaClient } from "@prisma/client";
import { ValidationError, ConflictError, NotFoundError } from "../utils/errorHandler";
const prisma = new PrismaClient();

export async function create(input: {
  customerId: string;
  workshopId: string;
  timeSlotId: string;
}) {
  const slot = await prisma.timeSlot.findUnique({
    where: { id: input.timeSlotId },
    include: { workshop: true },
  });

  if (!slot || slot.workshopId !== input.workshopId) {
    throw new ValidationError("Invalid time slot for workshop");
  }

  if (slot.availableSpots <= 0) {
    throw new ConflictError("Time slot is full");
  }

  const existing = await prisma.booking.findFirst({
    where: {
      customerId: input.customerId,
      workshopId: input.workshopId,
      timeSlotId: input.timeSlotId,
      deleted: false,
    },
  });

  if (existing) {
    throw new ConflictError("Customer already booked this time slot");
  }

  const booking = await prisma.booking.create({
    data: {
      customerId: input.customerId,
      workshopId: input.workshopId,
      timeSlotId: input.timeSlotId,
    },
  });

  await prisma.timeSlot.update({
    where: { id: input.timeSlotId },
    data: { availableSpots: { decrement: 1 } },
  });

  return booking;
}

export async function getAll(options?: {
  page?: number;
  limit?: number;
  status?: string;
  workshopId?: string;
  customerId?: string;
}) {
  const page = options?.page ?? 1;
  const limit = options?.limit ?? 10;
  const skip = (page - 1) * limit;
  const where: any = { deleted: false };
  if (options?.status) where.status = options.status;
  if (options?.workshopId) where.workshopId = options.workshopId;
  if (options?.customerId) where.customerId = options.customerId;

  const [data, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      include: {
        customer: { select: { name: true, email: true } },
        workshop: { select: { title: true } },
        timeSlot: { select: { startTime: true, endTime: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.booking.count({ where }),
  ]);
  return {
    data,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}

export async function updateStatus(id: string, status: string) {
  try {
    return await prisma.booking.update({
      where: { id },
      data: { status },
    });
  } catch (error: any) {
    if (error.name === 'PrismaClientKnownRequestError' && error.code === 'P2025') {
      throw new NotFoundError("Booking not found");
    }
    throw error;
  }
}

export async function getByCustomerId(customerId: string) {
  return prisma.booking.findMany({
    where: { customerId, deleted: false },
    include: {
      workshop: true,
      timeSlot: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}
