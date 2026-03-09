import request from "supertest";
import express from "express";
import insightsRoutes from "../../src/routes/insights";

jest.mock("../../src/controllers/insightsController", () => ({
  getAllWisdom: jest.fn((req: any, res: any) => res.json({ message: "getAllWisdom called" })),
  getFeaturedWisdom: jest.fn((req: any, res: any) =>
    res.json({ message: "getFeaturedWisdom called" }),
  ),
  starWisdom: jest.fn((req: any, res: any) =>
    res.json({ message: "starWisdom called" }),
  ),
}));

const app = express();
app.use(express.json());
app.use("/wisdom", insightsRoutes);

describe("Wisdom Routes", () => {
  it("GET /wisdom should call getAllWisdom controller", async () => {
    const response = await request(app).get("/wisdom");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "getAllWisdom called" });
  });

  it("GET /wisdom/featured should call getFeaturedWisdom controller", async () => {
    const response = await request(app).get("/wisdom/featured");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "getFeaturedWisdom called" });
  });

  it("PUT /wisdom/:id/star should call starWisdom controller", async () => {
    const response = await request(app).put("/wisdom/1/star");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "starWisdom called" });
  });
});
