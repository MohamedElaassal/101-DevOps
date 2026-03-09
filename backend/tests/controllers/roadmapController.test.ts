import { Request, Response } from "express";
import {
  getCheckpoints,
  updateCheckpoint,
} from "../../src/controllers/roadmapController";
import { db } from "../../src/db/connection";

const mockDb = db as jest.Mocked<typeof db>;

describe("Roadmap Controller", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe("getCheckpoints", () => {
    it("should return all checkpoints", async () => {
      const mockData = [
        { id: 1, step: 1, title: "Linux Basics", phase: "Foundation", done: false, memo: null, finished_at: null },
        { id: 2, step: 2, title: "Git Basics", phase: "Foundation", done: true, memo: "Done!", finished_at: "2024-01-01" },
      ];

      // @ts-ignore
      mockDb.query.mockResolvedValue([mockData]);

      await getCheckpoints(mockReq as Request, mockRes as Response);

      expect(mockDb.query).toHaveBeenCalledWith(
        "SELECT * FROM checkpoints ORDER BY step",
      );
      expect(mockRes.json).toHaveBeenCalledWith(mockData);
    });

    it("should handle database errors", async () => {
      // @ts-ignore
      mockDb.query.mockRejectedValue(new Error("Database error"));

      await getCheckpoints(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Failed to fetch checkpoints",
      });
    });
  });

  describe("updateCheckpoint", () => {
    beforeEach(() => {
      mockReq = {
        params: { step: "5" },
        body: { done: true, memo: "Docker is awesome!" },
      };
    });

    it("should update checkpoint with done status and memo", async () => {
      const mockUpdated = {
        id: 5,
        step: 5,
        title: "Build Your First Container Image",
        phase: "Foundation",
        done: true,
        memo: "Docker is awesome!",
        finished_at: "2024-01-01T10:00:00Z",
      };

      // @ts-ignore
      mockDb.query.mockResolvedValueOnce([{}]);
      // @ts-ignore
      mockDb.query.mockResolvedValueOnce([[mockUpdated]]);

      await updateCheckpoint(mockReq as Request, mockRes as Response);

      expect(mockDb.query).toHaveBeenCalledWith(
        "UPDATE checkpoints SET done = ?, memo = ?, finished_at = ? WHERE step = ?",
        [true, "Docker is awesome!", expect.any(Date), "5"],
      );
      expect(mockRes.json).toHaveBeenCalledWith(mockUpdated);
    });

    it("should handle marking a step as not done", async () => {
      mockReq.body = { done: false, memo: null };
      const mockUpdated = {
        id: 5,
        step: 5,
        title: "Build Your First Container Image",
        phase: "Foundation",
        done: false,
        memo: null,
        finished_at: null,
      };

      // @ts-ignore
      mockDb.query.mockResolvedValueOnce([{}]);
      // @ts-ignore
      mockDb.query.mockResolvedValueOnce([[mockUpdated]]);

      await updateCheckpoint(mockReq as Request, mockRes as Response);

      expect(mockDb.query).toHaveBeenCalledWith(
        "UPDATE checkpoints SET done = ?, memo = ?, finished_at = ? WHERE step = ?",
        [false, null, null, "5"],
      );
    });

    it("should handle database errors", async () => {
      // @ts-ignore
      mockDb.query.mockRejectedValue(new Error("Database error"));

      await updateCheckpoint(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Failed to update checkpoint",
      });
    });
  });
});
