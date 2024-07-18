import express from "express";
import { deleteAll, getFinalizedRequirements } from "../controller/finalized";
const router = express.Router();

router.get("/", getFinalizedRequirements);
router.delete("/", deleteAll);

export default router;
