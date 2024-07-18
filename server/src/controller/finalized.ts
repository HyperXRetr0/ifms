import { Request, Response } from "express";
import State from "../models/states";
import Requirement from "../models/requirement";
import FinalQuantity from "../models/finalized";

export const getFinalizedRequirements = async (req: Request, res: Response) => {
  try {
    const { state: stateName, year, month } = req.query;

    const state = await State.findOne({ state: stateName });
    if (!state) {
      return res.status(404).json({
        success: false,
        message: "State not found",
      });
    }

    // Fetch proposed requirements from the Requirement model
    const proposedReq: any = await Requirement.aggregate([
      {
        $match: {
          state: state._id,
          month,
        },
      },
      {
        $group: {
          _id: { product: "$product" },
          totalQty: { $sum: "$quantity" },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id.product",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $project: {
          _id: 0,
          month,
          product: { $arrayElemAt: ["$product.product", 0] },
          totalQty: 1,
        },
      },
      {
        $sort: { product: 1 },
      },
    ]);

    // Fetch finalized requirements from the Finalized model
    const finalizedReq: any = await FinalQuantity.aggregate([
      {
        $match: {
          state: state._id,
          month,
        },
      },
      {
        $group: {
          _id: { product: "$product" },
          totalQty: { $sum: "$quantity" },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id.product",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $project: {
          _id: 0,
          month,
          product: { $arrayElemAt: ["$product.product", 0] },
          totalQty: 1,
        },
      },
      {
        $sort: { product: 1 },
      },
    ]);

    // Create a map of product totals for proposed requirements
    const proposedProductTotals: { [product: string]: number } = {};
    proposedReq.forEach((req: any) => {
      proposedProductTotals[req.product] = req.totalQty;
    });

    // Create a map of product totals for finalized requirements
    const finalizedProductTotals: { [product: string]: number } = {};
    finalizedReq.forEach((req: any) => {
      finalizedProductTotals[req.product] = req.totalQty;
    });

    // Create a map of finalized quantities to overlay on proposed quantities
    const finalizedMap = new Map();
    finalizedReq.forEach((req: any) => {
      finalizedMap.set(req.product, req.totalQty);
    });

    // Overlay finalized quantities on proposed quantities and calculate totals
    const combinedQuantities = proposedReq.map((req: any) => {
      const finalizedQuantity = finalizedMap.get(req.product) || req.totalQty;
      return {
        ...req,
        finalizedQty: finalizedQuantity,
      };
    });

    const data = {
      proposedQuantity: proposedReq,
      finalizedQuantity: combinedQuantities,
      totalProposedQuantity: proposedReq.reduce(
        (total: number, req: any) => total + req.totalQty,
        0
      ),
      totalFinalizedQuantity: finalizedReq.reduce(
        (total: number, req: any) => total + req.totalQty,
        0
      ),
      proposedProductTotals,
      finalizedProductTotals,
    };

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const deleteAll = async (req: Request, res: Response) => {
  try {
    await FinalQuantity.deleteMany({});
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

// export const getFinalizedRequirements = async (req: Request, res: Response) => {
//   try {
//     const { state: stateName, month, year } = req.query;
//     const state = await State.findOne({ state: stateName });
//     if (!state) {
//       return res.status(404).json({
//         success: false,
//         message: "State not found",
//       });
//     }
//     const proposedRequirements = await Requirement.find({
//       state: state._id,
//       month,
//     });
//     const approvedRequirements = await DacApprovedQuantity.find({
//       state: state._id,
//       month,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       success: false,
//       message: "Something went wrong",
//     });
//   }
// };
