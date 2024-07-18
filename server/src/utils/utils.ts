import DacApprovedQuantity from "../models/dac";
import Requirement from "../models/requirement";
import FinalQuantity from "../models/finalized";

export const saveToDac = async (data: any) => {
  const { state, product, month } = data;

  try {
    const requirements = await Requirement.find({
      state,
      product,
      month,
    });

    let totalQuantity = 0;

    requirements.forEach((req) => {
      totalQuantity += req.quantity;
    });

    console.log(month + " " + totalQuantity);

    let dacRecord = await DacApprovedQuantity.findOne({
      state,
      product,
      month,
    });

    if (dacRecord) {
      dacRecord.quantity = totalQuantity;
      await dacRecord.save();
    } else {
      dacRecord = new DacApprovedQuantity({
        state,
        product,
        month,
        quantity: totalQuantity,
      });
      await dacRecord.save();
    }
  } catch (error) {
    throw new Error("Something went wrong");
  }
};

//   try {
//     const { state, product, monh } = data;
//     const approvedReq = await DacApprovedQuantity.findOne({
//       state: state._id,
//       product: product._id,
//     });
//     if (!approvedReq) {
//       throw new Error("Requirement not found");
//     }
//     const approvedQty = approvedReq.quantity;

//     const proposedReq = await Requirement.find({
//       state: state._id,
//       product: product._id,
//     });
//     if (proposedReq.length === 0) {
//       throw new Error(
//         "No district requirements found for the specified state, product, and month"
//       );
//     }
//     let proposedQty = 0;
//     proposedReq.forEach((qty) => {
//       proposedQty += qty.quantity;
//     });

//     for (const req of proposedReq) {
//       const districtRequirement = req.quantity;
//       const finalizedQuantity =
//         (districtRequirement / proposedQty) * approvedQty;

//       const existingFinalized = await FinalQuantity.findOne({
//         state: req.state,
//         district: req.district,
//         product: req.product,
//         month: req.month,
//       });

//       if (existingFinalized) {
//         existingFinalized.quantity = finalizedQuantity;
//         await existingFinalized.save();
//       } else {
//         const newFinalized = new FinalQuantity({
//           state: req.state,
//           district: req.district,
//           product: req.product,
//           month: req.month,
//           quantity: finalizedQuantity,
//         });
//         await newFinalized.save();
//       }
//     }

//     console.log("Data Saved to Finalized Model");
//   } catch (error) {
//     console.log(error);
//     throw new Error("Failed to save data to Finalized Model");
//   }
// };

export const saveToFinal = async (data: any) => {
  try {
    const { state, quantity: approvedQty, product, month } = data;

    // Find all district requirements for the specified state, product, and month
    const proposedReq = await Requirement.find({
      state: state._id,
      product: product._id,
      month,
    });

    if (proposedReq.length === 0) {
      throw new Error(
        "No district requirements found for the specified state, product, and month"
      );
    }

    // Calculate total proposed quantity for all districts
    let proposedQty = 0;
    proposedReq.forEach((qty) => {
      proposedQty += qty.quantity;
    });

    // Loop through each district requirement
    for (const req of proposedReq) {
      const districtRequirement = req.quantity;
      const finalizedQuantity =
        (districtRequirement / proposedQty) * approvedQty;

      // Check if there's an existing finalized entry for the district
      const existingFinalized = await FinalQuantity.findOne({
        state: req.state,
        district: req.district,
        product: req.product,
        month: req.month,
      });

      if (existingFinalized) {
        // Update quantity if existing finalized entry found
        existingFinalized.quantity = finalizedQuantity;
        await existingFinalized.save();
      } else {
        // Create new finalized entry if not found
        const newFinalized = new FinalQuantity({
          state: req.state,
          district: req.district,
          product: req.product,
          month: req.month,
          quantity: finalizedQuantity,
        });
        await newFinalized.save();
      }
    }

    console.log("Data Saved to Finalized Model");
  } catch (error) {
    console.log(error);
    throw new Error("Failed to save data to Finalized Model");
  }
};
