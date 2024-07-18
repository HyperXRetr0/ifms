import { Request, Response } from "express";
import DacApprovedQuantity from "../models/dac";
import State from "../models/states";
import Product from "../models/product";
import { saveToFinal } from "../utils/utils";

export type Data = {
  state: string;
  product: string;
  month: string;
  quantity: number;
};

export const getDacApprovedData = async (req: Request, res: Response) => {
  try {
    const { monthGroup, year, product: productName } = req.query;
    const product = await Product.findOne({ product: productName });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let months: string[] = [];
    if (monthGroup === "Kharif") {
      months = ["April", "May", "June", "July", "August", "September"];
    } else if (monthGroup === "Rabi") {
      months = [
        "October",
        "November",
        "December",
        "January",
        "February",
        "March",
      ];
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid month group",
      });
    }

    let startYear: number, endYear: number;
    if (typeof year === "string") {
      const yearParts = year.split("-").map(Number);
      if (
        yearParts.length === 2 &&
        !isNaN(yearParts[0]) &&
        !isNaN(yearParts[1])
      ) {
        startYear = yearParts[0];
        endYear = yearParts[1];
      } else {
        return res.status(400).json({
          success: false,
          message: "Invalid year format",
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "Year parameter is required",
      });
    }

    // Aggregate DacApprovedQuantity based on state, product, and months
    const data = await DacApprovedQuantity.aggregate([
      {
        $match: {
          product: product._id,
          month: { $in: months },
          createdAt: {
            $gte: new Date(`${startYear}-01-01`),
            $lte: new Date(`${endYear}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { state: "$state", month: "$month" },
          totalQuantity: { $sum: "$quantity" },
        },
      },
      {
        $lookup: {
          from: "states",
          localField: "_id.state",
          foreignField: "_id",
          as: "state",
        },
      },
      {
        $unwind: "$state",
      },
      {
        $project: {
          _id: 0,
          state: "$state.state",
          month: "$_id.month",
          totalQuantity: 1,
        },
      },
    ]);

    // Prepare response data structure
    const stateMap = new Map<string, any>();
    const monthTotals: { [key: string]: number } = {};
    const states = await State.find({});

    states.forEach((state) => {
      const stateData: any = {
        state: state.state,
        monthlyQuantities: {},
      };
      months.forEach((month) => {
        stateData.monthlyQuantities[month] = 0;
        monthTotals[month] = 0;
      });
      stateMap.set(state.state, stateData);
    });

    data.forEach((d) => {
      const stateData = stateMap.get(d.state);
      stateData.monthlyQuantities[d.month] = d.totalQuantity;
      monthTotals[d.month] += d.totalQuantity;
    });

    const response = {
      states: Array.from(stateMap.values()),
      product: product.product,
      monthTotals,
    };

    return res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error("Error in getDacApprovedData:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const deleteAll = async (req: Request, res: Response) => {
  try {
    await DacApprovedQuantity.deleteMany({});
    return res.status(201).json({
      success: true,
      message: "All Data Deleted Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const changeDacApproved = async (req: Request, res: Response) => {
  try {
    const { state, product, month, quantity } = req.body;
    const stateDoc = await State.findOne({ state });
    const productDoc = await Product.findOne({ product });

    // Check if state and product exist
    if (!stateDoc || !productDoc) {
      return res.status(404).json({
        success: false,
        message: "State, District, or Product not found",
      });
    }

    // Check if there's an existing requirement in DacApprovedQuantity
    const existingRequirement = await DacApprovedQuantity.findOne({
      state: stateDoc._id,
      product: productDoc._id,
      month,
    });

    if (existingRequirement) {
      // Update quantity if existing requirement found
      existingRequirement.quantity = quantity;
      await existingRequirement.save();
    } else {
      // Create new requirement if not found
      const newRequirement = new DacApprovedQuantity({
        state: stateDoc._id,
        product: productDoc._id,
        month,
        quantity,
      });
      await newRequirement.save();
    }

    // Prepare arguments for saveToFinal function
    const args = {
      state: stateDoc,
      quantity,
      month,
      product: productDoc,
    };

    // Call saveToFinal to update Finalized model
    await saveToFinal(args);

    return res.status(201).json({
      success: true,
      message: "Requirement added/updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
