import mongoose from "mongoose";
import { RequirementType } from "./requirement";

const finalizedSchema = new mongoose.Schema<RequirementType>(
  {
    state: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "State",
      required: true,
    },
    district: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "District",
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

const FinalQuantity = mongoose.model<RequirementType>(
  "FinalQuantity",
  finalizedSchema
);
export default FinalQuantity;
