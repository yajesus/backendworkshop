import request from "supertest";
import app from "../app";

describe("GET /api/workshops", () => {
  it("should return a list of workshops", async () => {
    const res = await request(app).get("/api/workshops");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty("title");
      expect(res.body[0]).toHaveProperty("timeSlots");
    }
  });
});
