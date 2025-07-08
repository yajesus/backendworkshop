import { Request, Response } from "express";
import * as BookingService from "../services/booking.service";
import { asyncHandler, ValidationError, ConflictError, NotFoundError } from "../utils/errorHandler";

export const createBooking = asyncHandler(async (req: any, res: Response) => {
  console.log('Received booking request', req.body);
  const { customerId, workshopId, timeSlotId } = req.body;

  if (!customerId || !workshopId || !timeSlotId) {
    throw new ValidationError("Customer ID, workshop ID, and time slot ID are required");
  }

  try {
    const booking = await BookingService.create({ customerId, workshopId, timeSlotId });
    res
      .status(201)
      .json({ id: booking.id, message: "Booking submitted successfully" });
  } catch (error: any) {
    console.error('Booking error:', error.message, error);
    if (error.message === "Invalid time slot for workshop") {
      throw new ValidationError("Invalid time slot for the specified workshop");
    } else if (error.message === "Time slot is full") {
      throw new ConflictError("This time slot is already full");
    } else if (error.message === "Customer already booked this time slot") {
      throw new ConflictError("You have already booked this time slot");
    }
    throw error;
  }
});

export const getAllBookings = asyncHandler(async (req: Request, res: Response) => {
  try {
    const bookings = await BookingService.getAll();
    res.json(bookings);
  } catch (error: any) {
    throw error;
  }
});

export const updateBookingStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  
  if (!id) {
    throw new ValidationError("Booking ID is required");
  }
  
  if (!status) {
    throw new ValidationError("Status is required");
  }
  
  const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
  if (!validStatuses.includes(status)) {
    throw new ValidationError("Invalid status. Must be one of: pending, confirmed, cancelled, completed");
  }
  
  try {
    const updated = await BookingService.updateStatus(id, status);
    res.json(updated);
  } catch (error: any) {
    if (error.name === 'PrismaClientKnownRequestError' && (error as any).code === 'P2025') {
      throw new NotFoundError("Booking not found");
    }
    throw error;
  }
});

export const getMyBookings = asyncHandler(async (req: any, res: Response) => {
  const customerId = req.user?.id;
  if (!customerId) {
    throw new ValidationError('Customer ID not found in token');
  }
  const bookings = await BookingService.getByCustomerId(customerId);
  res.json(bookings);
});
