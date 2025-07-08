import { z } from "zod";

export const createBookingSchema = z.object({
  customerId: z.string().uuid(),
  workshopId: z.string().uuid(),
  timeSlotId: z.string().uuid(),
});
export const updateBookingStatusSchema = z.object({
  status: z.enum(["pending", "confirmed", "canceled"]),
});
