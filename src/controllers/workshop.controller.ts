import { Request, Response } from 'express';
import * as WorkshopService from '../services/workshop.service';
import { asyncHandler, ValidationError, NotFoundError } from '../utils/errorHandler';
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
export const createWorkshop = asyncHandler(async (req: Request, res: Response) => {
  console.log('Received workshop creation request:', req.body);
  const { title, description, date, maxCapacity, timeSlots } = req.body as WorkshopInput;
  
  if (!title || !description || !date || !maxCapacity || !timeSlots) {
    throw new ValidationError("Title, description, date, maxCapacity, and timeSlots are required");
  }
  
  if (maxCapacity <= 0) {
    throw new ValidationError("Max capacity must be greater than 0");
  }
  
  if (!Array.isArray(timeSlots) || timeSlots.length === 0) {
    throw new ValidationError("At least one time slot is required");
  }
  
  // Validate time slots
  for (const slot of timeSlots) {
    if (!slot.startTime || !slot.endTime || slot.availableSpots <= 0) {
      throw new ValidationError("Each time slot must have startTime, endTime, and availableSpots > 0");
    }
  }
  
  try {
    const data = await WorkshopService.create(req.body as WorkshopInput);
    res.status(201).json(data);
  } catch (error: any) {
    throw error;
  }
});

export const getAllWorkshops = asyncHandler(async (req: Request, res: Response) => {
  try {
    const data = await WorkshopService.getAll();
    res.json(data);
  } catch (error: any) {
    throw error;
  }
});

export const updateWorkshop = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  if (!id) {
    throw new ValidationError("Workshop ID is required");
  }
  
  try {
    const data = await WorkshopService.update(id, req.body as Partial<WorkshopInput>);
    res.json(data);
  } catch (error: any) {
    if (error.name === 'PrismaClientKnownRequestError' && (error as any).code === 'P2025') {
      throw new NotFoundError("Workshop not found");
    }
    throw error;
  }
});

export const deleteWorkshop = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  if (!id) {
    throw new ValidationError("Workshop ID is required");
  }
  
  try {
    await WorkshopService.softDelete(id);
    res.status(204).send();
  } catch (error: any) {
    if (error.name === 'PrismaClientKnownRequestError' && (error as any).code === 'P2025') {
      throw new NotFoundError("Workshop not found");
    }
    throw error;
  }
});

export const getWorkshopById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    throw new ValidationError('Workshop ID is required');
  }
  const workshop = await WorkshopService.getById(id);
  if (!workshop) {
    throw new NotFoundError('Workshop not found');
  }
  res.json(workshop);
});
