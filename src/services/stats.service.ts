import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getStats() {
  const totalBookings = await prisma.booking.count({
    where: { deleted: false },
  });

  const totalSlots = await prisma.timeSlot.findMany({
    select: {
      availableSpots: true,
      workshop: { select: { maxCapacity: true } },
    },
  });

  const totalSpots = totalSlots.reduce(
    (sum, slot) => sum + slot.workshop.maxCapacity,
    0
  );
  const remainingSpots = totalSlots.reduce(
    (sum, slot) => sum + slot.availableSpots,
    0
  );
  const filledSlotsPercentage =
    totalSpots === 0
      ? 0
      : Math.round(((totalSpots - remainingSpots) / totalSpots) * 100);

  const bookingsPerWorkshop = await prisma.booking.groupBy({
    by: ["workshopId"],
    _count: true,
  });

  const popular = await prisma.workshop.findMany({
    where: { deleted: false },
    include: { bookings: true },
  });

  const sorted = popular
    .map((w) => ({ title: w.title, count: w.bookings.length }))
    .sort((a, b) => b.count - a.count);

  return {
    totalBookings,
    filledSlotsPercentage,
    mostPopularWorkshop: sorted[0] || null,
    bookingsPerWorkshop: sorted,
  };
}
