import express from "express";
import {
  changeDacApproved,
  deleteAll,
  getDacApprovedData,
} from "../controller/dac";
const router = express.Router();

router.get("/", getDacApprovedData);
router.post("/update-data", changeDacApproved);
router.delete("/", deleteAll);

export default router;
