import mongoose from "mongoose";
import StateModel from "../models/states";
import DistrictModel from "../models/districts";
import { districtFormData } from "../../../client/src/config/district-input-config";

async function insertData() {
  try {
    await mongoose.connect(
      "mongodb+srv://guptamayank2003:l54z6PYY9svakKdf@cluster0.pgvaznj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    );

    for (const data of districtFormData) {
      let stateDoc = await StateModel.findOne({ state: data.state });
      if (!stateDoc) {
        stateDoc = await StateModel.create({ state: data.state });
      }

      for (const districtName of data.district) {
        await DistrictModel.create({
          state: stateDoc._id,
          district: districtName,
        });
      }
    }

    console.log("Data insertion completed.");
  } catch (error) {
    console.error("Error inserting data:", error);
  } finally {
    await mongoose.disconnect();
  }
}

insertData().catch(console.error);
