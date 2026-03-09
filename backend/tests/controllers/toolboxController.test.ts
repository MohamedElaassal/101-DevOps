import { Request, Response } from "express";
import { getTools, rateTool } from "../../src/controllers/toolboxController";
import { db } from "../../src/db/connection";

const mockDb = db as jest.Mocked<typeof db>;

describe("Toolbox Controller", () => {
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

  describe("getTools", () => {
    it("should return all tools ordered by domain and rating", async () => {
      const mockTools = [
        { id: 1, name: "Docker", domain: "Containers", rating: 10 },
        { id: 2, name: "Terraform", domain: "IaC", rating: 8 },
        { id: 3, name: "TeamCity", domain: "CI/CD", rating: 15 },
      ];

      // @ts-ignore
      mockDb.query.mockResolvedValue([mockTools]);

      await getTools(mockReq as Request, mockRes as Response);

      expect(mockDb.query).toHaveBeenCalledWith(
        "SELECT * FROM toolkit ORDER BY domain, rating DESC",
      );
      expect(mockRes.json).toHaveBeenCalledWith(mockTools);
    });

    it("should handle database errors", async () => {
      // @ts-ignore
      mockDb.query.mockRejectedValue(new Error("Database error"));

      await getTools(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Failed to fetch tools",
      });
    });
  });

  describe("rateTool", () => {
    beforeEach(() => {
      mockReq = { params: { id: "1" } };
    });

    it("should increment tool rating", async () => {
      const mockUpdated = {
        id: 1,
        name: "Docker",
        domain: "Containers",
        rating: 11,
      };

      // @ts-ignore
      mockDb.query.mockResolvedValueOnce([{}]);
      // @ts-ignore
      mockDb.query.mockResolvedValueOnce([[mockUpdated]]);

      await rateTool(mockReq as Request, mockRes as Response);

      expect(mockDb.query).toHaveBeenCalledWith(
        "UPDATE toolkit SET rating = rating + 1 WHERE id = ?",
        ["1"],
      );
      expect(mockRes.json).toHaveBeenCalledWith(mockUpdated);
    });

    it("should handle database errors", async () => {
      // @ts-ignore
      mockDb.query.mockRejectedValue(new Error("Database error"));

      await rateTool(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Failed to rate tool",
      });
    });
  });
});
