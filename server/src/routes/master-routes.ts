import express from "express";
import {
  createProduct,
  createState,
  deleteAllDistricts,
} from "../controller/master-controller";
import { createDistrict } from "../controller/master-controller";

const router = express.Router();
router.post("/new-state", createState);
router.post("/new-district", createDistrict);
router.post("/new-product", createProduct);
router.delete("/delete-districts", deleteAllDistricts);

export default router;
