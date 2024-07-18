import express from "express";
import {
  addRequirements,
  deleteAllRequirementDoc,
  getRequirements,
} from "../controller/requirements";
const router = express.Router();

router.post("/add-requirement", addRequirements);

router.get("/", getRequirements);

router.delete("/", deleteAllRequirementDoc);

export default router;
