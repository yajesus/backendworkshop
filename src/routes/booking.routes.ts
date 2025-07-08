import { Router } from "express";
import {
  createBooking,
  getAllBookings,
  updateBookingStatus,
  getMyBookings,
} from "../controllers/booking.controller";
import { validate } from "../middleware/validate";
import {
  createBookingSchema,
  updateBookingStatusSchema,
} from "../validators/booking.schema";
import { authenticateToken, requireCustomer } from '../middleware/auth';

const router = Router();

router.post("/", validate(createBookingSchema), createBooking);
router.get("/", getAllBookings);
router.put("/:id", validate(updateBookingStatusSchema), updateBookingStatus);
router.get("/my", authenticateToken, requireCustomer, getMyBookings);

export default router;
