import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  await prisma.booking.deleteMany();
  await prisma.timeSlot.deleteMany();
  await prisma.workshop.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.admin.deleteMany();

  const admin = await prisma.admin.create({
    data: {
      email: "admin@example.com",
      password: await bcrypt.hash("admin123", 10),
    },
  });

  const customer1 = await prisma.customer.create({
    data: {
      name: "Alice Smith",
      email: "alice@example.com",
      password: await bcrypt.hash("password1", 10),
    },
  });

  const customer2 = await prisma.customer.create({
    data: {
      name: "Bob Johnson",
      email: "bob@example.com",
      password: await bcrypt.hash("password2", 10),
    },
  });

  const workshop1 = await prisma.workshop.create({
    data: {
      title: "Python 101",
      description: "Intro to Python",
      date: new Date("2025-07-10"),
      maxCapacity: 15,
      timeSlots: {
        create: [
          { startTime: "10:00 AM", endTime: "12:00 PM", availableSpots: 15 },
          { startTime: "1:00 PM", endTime: "3:00 PM", availableSpots: 15 },
        ],
      },
    },
    include: { timeSlots: true },
  });

  const workshop2 = await prisma.workshop.create({
    data: {
      title: "Yoga Basics",
      description: "Beginner Yoga Workshop",
      date: new Date("2025-07-11"),
      maxCapacity: 20,
      timeSlots: {
        create: [
          { startTime: "9:00 AM", endTime: "11:00 AM", availableSpots: 20 },
          { startTime: "2:00 PM", endTime: "4:00 PM", availableSpots: 20 },
        ],
      },
    },
    include: { timeSlots: true },
  });

  await prisma.booking.createMany({
    data: [
      {
        customerId: customer1.id,
        workshopId: workshop1.id,
        timeSlotId: workshop1.timeSlots[0].id,
        status: "confirmed",
      },
      {
        customerId: customer2.id,
        workshopId: workshop1.id,
        timeSlotId: workshop1.timeSlots[1].id,
        status: "pending",
      },
      {
        customerId: customer1.id,
        workshopId: workshop2.id,
        timeSlotId: workshop2.timeSlots[0].id,
        status: "confirmed",
      },
      {
        customerId: customer2.id,
        workshopId: workshop2.id,
        timeSlotId: workshop2.timeSlots[1].id,
        status: "canceled",
      },
    ],
  });

  console.log("✅ Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
