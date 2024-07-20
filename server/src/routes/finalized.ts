import express from "express";
import {
  deleteAll,
  getFinalizedRequirements,
  updateFinalized,
} from "../controller/finalized";
const router = express.Router();

router.get("/", getFinalizedRequirements);
router.delete("/", deleteAll);
router.post("/update-final", updateFinalized);

export default router;
