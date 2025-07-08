import { Request, Response } from "express";
import * as AuthService from "../services/auth.service";
import { asyncHandler, UnauthorizedError, ConflictError } from "../utils/errorHandler";

export const adminLogin = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  
  try {
    const result = await AuthService.verifyAdmin(email, password);
    res.json(result);
  } catch (error: any) {
    if (error.message === "Invalid credentials") {
      throw new UnauthorizedError("Invalid email or password");
    }
    throw error;
  }
});

export const customerLogin = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  
  try {
    const result = await AuthService.verifyCustomer(email, password);
    res.json(result);
  } catch (error: any) {
    if (error.message === "Invalid credentials") {
      throw new UnauthorizedError("Invalid email or password");
    }
    throw error;
  }
});

export const customerRegister = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  
  try {
    const result = await AuthService.registerCustomer(req.body);
    res.status(201).json(result);
  } catch (error: any) {
    if (error.message === "Email already in use") {
      throw new ConflictError("Email already registered");
    }
    throw error;
  }
});
