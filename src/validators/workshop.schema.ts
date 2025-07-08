import { z } from 'zod';

export const timeSlotSchema = z.object({
  startTime: z.string(),
  endTime: z.string(),
  availableSpots: z.number().int().positive()
});

export const createWorkshopSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.string(),
  maxCapacity: z.number().int().positive(),
  timeSlots: z.array(timeSlotSchema)
});

export const updateWorkshopSchema = createWorkshopSchema.partial();