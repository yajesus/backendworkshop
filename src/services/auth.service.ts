import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt";
import { UnauthorizedError, ConflictError } from "../utils/errorHandler";

const prisma = new PrismaClient();

export async function verifyAdmin(email: string, password: string) {
  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin || !(await bcrypt.compare(password, admin.password))) {
    throw new UnauthorizedError("Invalid credentials");
  }
  return { token: generateToken({ id: admin.id, role: "admin" }) };
}

export async function verifyCustomer(email: string, password: string) {
  const customer = await prisma.customer.findUnique({ where: { email } });
  if (!customer || !(await bcrypt.compare(password, customer.password))) {
    throw new UnauthorizedError("Invalid credentials");
  }
  return {
    token: generateToken({ id: customer.id, role: "customer" }),
    user: { id: customer.id, name: customer.name, email: customer.email }
  };
}

export async function registerCustomer(data: {
  name: string;
  email: string;
  password: string;
}) {
  const existing = await prisma.customer.findUnique({
    where: { email: data.email },
  });
  if (existing) throw new ConflictError("Email already in use");
  const hash = await bcrypt.hash(data.password, 10);
  const customer = await prisma.customer.create({
    data: { name: data.name, email: data.email, password: hash },
  });
  return {
    token: generateToken({ id: customer.id, role: "customer" }),
    user: { id: customer.id, name: customer.name, email: customer.email }
  };
}
