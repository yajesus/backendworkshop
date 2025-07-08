import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { ValidationError } from "../utils/errorHandler";

export function validate(schema: ZodSchema<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err: any) {
      // Extract the first validation error message
      const errorMessage = err.errors?.[0]?.message || "Validation failed";
      throw new ValidationError(errorMessage);
    }
  };
}
