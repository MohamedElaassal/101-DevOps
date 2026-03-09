import express from "express";
import { getCheckpoints, updateCheckpoint } from "../controllers/roadmapController";

const router = express.Router();

router.get("/", getCheckpoints);
router.put("/:step", updateCheckpoint);

export default router;
