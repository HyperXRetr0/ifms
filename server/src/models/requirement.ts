import mongoose from "mongoose";

export type RequirementType = {
  _id: string;
  state: mongoose.Schema.Types.ObjectId;
  district: mongoose.Schema.Types.ObjectId;
  product: mongoose.Schema.Types.ObjectId;
  month: string;
  quantity: number;
  createdAt: Date;
};

const requirementSchema = new mongoose.Schema<RequirementType>(
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

const Requirement = mongoose.model<RequirementType>(
  "Requirement",
  requirementSchema
);
export default Requirement;
