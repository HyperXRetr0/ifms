import mongoose from "mongoose";

export type DistrictType = {
  _id: string;
  state: mongoose.Schema.Types.ObjectId;
  district: string;
};

const districtSchema = new mongoose.Schema<DistrictType>({
  state: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "State",
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
});

const District = mongoose.model<DistrictType>("District", districtSchema);
export default District;
