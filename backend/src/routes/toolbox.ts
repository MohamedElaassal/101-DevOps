import express from "express";
import { getTools, rateTool } from "../controllers/toolboxController";

const router = express.Router();

router.get("/", getTools);
router.put("/:id/rate", rateTool);

export default router;
