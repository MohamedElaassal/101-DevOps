import request from "supertest";
import express from "express";
import toolboxRoutes from "../../src/routes/toolbox";

jest.mock("../../src/controllers/toolboxController", () => ({
  getTools: jest.fn((req: any, res: any) => res.json({ message: "getTools called" })),
  rateTool: jest.fn((req: any, res: any) =>
    res.json({ message: "rateTool called" }),
  ),
}));

const app = express();
app.use(express.json());
app.use("/toolkit", toolboxRoutes);

describe("Toolkit Routes", () => {
  it("GET /toolkit should call getTools controller", async () => {
    const response = await request(app).get("/toolkit");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "getTools called" });
  });

  it("PUT /toolkit/:id/rate should call rateTool controller", async () => {
    const response = await request(app).put("/toolkit/1/rate");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "rateTool called" });
  });
});
