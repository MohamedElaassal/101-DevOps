import request from "supertest";
import express, { Request, Response } from "express";
import roadmapRoutes from "../../src/routes/roadmap";

jest.mock("../../src/controllers/roadmapController", () => ({
  getCheckpoints: jest.fn((req: Request, res: Response) =>
    res.json({ message: "getCheckpoints called" }),
  ),
  updateCheckpoint: jest.fn((req: Request, res: Response) =>
    res.json({ message: "updateCheckpoint called" }),
  ),
}));

const app = express();
app.use(express.json());
app.use("/journey", roadmapRoutes);

describe("Journey Routes", () => {
  it("GET /journey should call getCheckpoints controller", async () => {
    const response = await request(app).get("/journey");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "getCheckpoints called" });
  });

  it("PUT /journey/:step should call updateCheckpoint controller", async () => {
    const response = await request(app)
      .put("/journey/5")
      .send({ done: true, memo: "Test notes" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "updateCheckpoint called" });
  });
});
