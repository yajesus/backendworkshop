import { Request, Response } from "express";
import * as StatsService from "../services/stats.service";
import { asyncHandler, ServiceUnavailableError } from "../utils/errorHandler";

export const getStats = asyncHandler(async (req: Request, res: Response) => {
  try {
    const stats = await StatsService.getStats();
    res.json(stats);
  } catch (error: any) {
    // If stats service fails, it's likely a database or service issue
    throw new ServiceUnavailableError("Unable to retrieve statistics at this time");
  }
});
