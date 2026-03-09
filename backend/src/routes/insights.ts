import express from "express";
import {
  getAllWisdom,
  getFeaturedWisdom,
  starWisdom,
} from "../controllers/insightsController";

const router = express.Router();

router.get("/", getAllWisdom);
router.get("/featured", getFeaturedWisdom);
router.put("/:id/star", starWisdom);

export default router;
