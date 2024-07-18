import mongoose from "mongoose";

type StateType = {
  _id: string;
  state: string;
};

const stateSchema = new mongoose.Schema<StateType>({
  state: {
    type: String,
    required: true,
  },
});

const State = mongoose.model<StateType>("State", stateSchema);
export default State;
