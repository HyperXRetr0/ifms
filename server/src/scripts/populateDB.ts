import mongoose from "mongoose";
import StateModel from "../models/states"; // Adjust path as necessary
import DistrictModel from "../models/districts"; // Adjust path as necessary
import { districtFormData } from "../../../client/src/config/district-input-config";

async function insertData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      "mongodb+srv://guptamayank2003:l54z6PYY9svakKdf@cluster0.pgvaznj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    );

    // Loop through each state and its districts
    for (const data of districtFormData) {
      // Find or create the state in the State model
      let stateDoc = await StateModel.findOne({ state: data.state });
      if (!stateDoc) {
        stateDoc = await StateModel.create({ state: data.state });
      }

      // Insert districts into the District model
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
    // Disconnect from MongoDB
    await mongoose.disconnect();
  }
}

// Run the insertion function
insertData().catch(console.error);
