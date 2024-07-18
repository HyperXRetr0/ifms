import mongoose from "mongoose";
import { RequirementType } from "./requirement";

type DacSchema = Omit<RequirementType, "district">;

const dacSchema = new mongoose.Schema<DacSchema>(
  {
    state: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "State",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    month: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const DacApprovedQuantity = mongoose.model<DacSchema>(
  "DacApprovedQuantity",
  dacSchema
);
export default DacApprovedQuantity;
