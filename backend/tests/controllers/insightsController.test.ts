import { Request, Response } from "express";
import {
  getAllWisdom,
  getFeaturedWisdom,
  starWisdom,
} from "../../src/controllers/insightsController";
import { db } from "../../src/db/connection";

const mockDb = db as jest.Mocked<typeof db>;

describe("Insights Controller", () => {
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

  describe("getAllWisdom", () => {
    it("should return all wisdom entries ordered by stars", async () => {
      const mockEntries = [
        { id: 1, message: "Wisdom 1", author: "Author 1", category: "IaC", stars: 5 },
        { id: 2, message: "Wisdom 2", author: "Author 2", category: "Monitoring", stars: 3 },
      ];

      // @ts-ignore
      mockDb.query.mockResolvedValue([mockEntries]);

      await getAllWisdom(mockReq as Request, mockRes as Response);

      expect(mockDb.query).toHaveBeenCalledWith(
        "SELECT * FROM wisdom ORDER BY stars DESC",
      );
      expect(mockRes.json).toHaveBeenCalledWith(mockEntries);
    });

    it("should handle database errors", async () => {
      // @ts-ignore
      mockDb.query.mockRejectedValue(new Error("Database error"));

      await getAllWisdom(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Failed to fetch wisdom entries",
      });
    });
  });

  describe("getFeaturedWisdom", () => {
    it("should return a random wisdom entry", async () => {
      const mockEntry = {
        id: 3,
        message: "Chaos engineering reveals weaknesses",
        author: "Netflix Engineering",
        category: "Resilience",
        stars: 2,
      };

      // @ts-ignore
      mockDb.query.mockResolvedValue([[mockEntry]]);

      await getFeaturedWisdom(mockReq as Request, mockRes as Response);

      expect(mockDb.query).toHaveBeenCalledWith(
        "SELECT * FROM wisdom ORDER BY RAND() LIMIT 1",
      );
      expect(mockRes.json).toHaveBeenCalledWith(mockEntry);
    });

    it("should handle database errors", async () => {
      // @ts-ignore
      mockDb.query.mockRejectedValue(new Error("Database error"));

      await getFeaturedWisdom(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Failed to fetch featured wisdom",
      });
    });
  });

  describe("starWisdom", () => {
    beforeEach(() => {
      mockReq = { params: { id: "1" } };
    });

    it("should increment wisdom stars", async () => {
      const mockUpdated = {
        id: 1,
        message: "Wisdom",
        author: "Author",
        category: "IaC",
        stars: 6,
      };

      // @ts-ignore
      mockDb.query.mockResolvedValueOnce([{}]);
      // @ts-ignore
      mockDb.query.mockResolvedValueOnce([[mockUpdated]]);

      await starWisdom(mockReq as Request, mockRes as Response);

      expect(mockDb.query).toHaveBeenCalledWith(
        "UPDATE wisdom SET stars = stars + 1 WHERE id = ?",
        ["1"],
      );
      expect(mockRes.json).toHaveBeenCalledWith(mockUpdated);
    });

    it("should handle database errors", async () => {
      // @ts-ignore
      mockDb.query.mockRejectedValue(new Error("Database error"));

      await starWisdom(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Failed to star wisdom entry",
      });
    });
  });
});
