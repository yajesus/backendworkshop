import request from "supertest";
import app from "../app";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

let customerId = "";
let workshopId = "";
let timeSlotId = "";

beforeAll(async () => {
  const customer = await prisma.customer.create({
    data: {
      name: "Test User",
      email: "test@example.com",
      password: "hashedpass",
    },
  });
  customerId = customer.id;

  const workshop = await prisma.workshop.create({
    data: {
      title: "Test Workshop",
      description: "Test Desc",
      date: new Date(),
      maxCapacity: 10,
      timeSlots: {
        create: [{ startTime: "10:00", endTime: "12:00", availableSpots: 10 }],
      },
    },
    include: { timeSlots: true },
  });
  workshopId = workshop.id;
  timeSlotId = workshop.timeSlots[0].id;
});

afterAll(async () => {
  await prisma.booking.deleteMany();
  await prisma.timeSlot.deleteMany();
  await prisma.workshop.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.$disconnect();
});

describe("POST /api/bookings", () => {
  it("should create a booking", async () => {
    const res = await request(app).post("/api/bookings").send({
      customerId,
      workshopId,
      timeSlotId,
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
  });

  it("should not allow duplicate booking", async () => {
    const res = await request(app).post("/api/bookings").send({
      customerId,
      workshopId,
      timeSlotId,
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/already booked/i);
  });
});
