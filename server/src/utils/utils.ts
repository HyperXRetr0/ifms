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

export const saveToFinal = async (data: any) => {
  try {
    const { state, quantity: approvedQty, product, month } = data;

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

    let proposedQty = 0;
    proposedReq.forEach((qty) => {
      proposedQty += qty.quantity;
    });

    for (const req of proposedReq) {
      const districtRequirement = req.quantity;
      const finalizedQuantity =
        (districtRequirement / proposedQty) * approvedQty;

      const existingFinalized = await FinalQuantity.findOne({
        state: req.state,
        district: req.district,
        product: req.product,
        month: req.month,
      });

      if (existingFinalized) {
        existingFinalized.quantity = finalizedQuantity;
        await existingFinalized.save();
      } else {
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
