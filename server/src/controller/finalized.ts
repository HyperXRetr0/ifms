import { Request, Response } from "express";
import State from "../models/states";
import Requirement from "../models/requirement";
import FinalQuantity from "../models/finalized";
import DacApprovedQuantity from "../models/dac";
import Product from "../models/product";
import District from "../models/districts";

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

export const getFinalizedRequirements = async (req: Request, res: Response) => {
  const { state: stateName, month } = req.query;
  try {
    const state = await State.findOne({ state: stateName });
    if (!state) {
      return res.status(404).json({
        success: false,
        message: "State not found",
      });
    }
    const proposedRequirements = await Requirement.aggregate([
      {
        $match: {
          state: state._id,
          month,
        },
      },
      {
        $group: {
          _id: { district: "$district", product: "$product" },
          proposedQty: {
            $sum: "$quantity",
          },
        },
      },
      {
        $lookup: {
          from: "districts",
          localField: "_id.district",
          foreignField: "_id",
          as: "district",
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
        $unwind: "$product",
      },
      {
        $unwind: "$district",
      },
      {
        $project: {
          _id: 0,
          proposedQty: 1,
          district: "$district.district",
          product: "$product.product",
        },
      },
      {
        $sort: { district: 1, product: 1 },
      },
    ]);
    if (!proposedRequirements) {
      return res.status(404).json({
        success: false,
        message: "Proposed Requirements not found",
      });
    }
    const finalRequirements = await FinalQuantity.aggregate([
      {
        $match: {
          state: state._id,
          month,
        },
      },
      {
        $group: {
          _id: { district: "$district", product: "$product" },
          scaledQty: {
            $sum: "$quantity",
          },
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
        $lookup: {
          from: "districts",
          localField: "_id.district",
          foreignField: "_id",
          as: "district",
        },
      },

      {
        $unwind: "$district",
      },
      {
        $unwind: "$product",
      },
      {
        $project: {
          _id: 0,
          scaledQty: 1,
          product: "$product.product",
          district: "$district.district",
        },
      },
      {
        $sort: { district: 1, product: 1 },
      },
    ]);
    if (!finalRequirements) {
      return res.status(404).json({
        success: false,
        message: "Final Requirements Not Found",
      });
    }
    interface CombinedRequirements {
      [key: string]: {
        district: string;
        product: string;
        proposedQty: number;
        scaledQty: number;
      };
    }
    const combinedRequirements: CombinedRequirements = {};

    proposedRequirements.forEach((req) => {
      const key = `${req.district}-${req.product}`;
      combinedRequirements[key] = {
        district: req.district,
        product: req.product,
        proposedQty: req.proposedQty,
        scaledQty: req.proposedQty,
      };
    });

    finalRequirements.forEach((req) => {
      const key = `${req.district}-${req.product}`;
      if (combinedRequirements[key]) {
        combinedRequirements[key].scaledQty = req.scaledQty;
      } else {
        combinedRequirements[key] = {
          district: req.district,
          product: req.product,
          proposedQty: 0,
          scaledQty: req.scaledQty,
        };
      }
    });

    const response = Object.values(combinedRequirements);
    return res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const updateFinalized = async (req: Request, res: Response) => {
  try {
    const {
      state: stateName,
      month,
      product: productName,
      district: districtName,
      quantity,
    } = req.body;
    const state = await State.findOne({ state: stateName });
    if (!state) {
      return res.status(404).json({
        success: false,
        message: "State not found",
      });
    }
    const product = await Product.findOne({ product: productName });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    const district = await District.findOne({ district: districtName });
    if (!district) {
      return res.status(404).json({
        success: false,
        message: "District not found",
      });
    }
    const finalReq = await FinalQuantity.findOne({
      district: district._id,
      state: state._id,
      product: product._id,
      month,
    });
    if (finalReq) {
      finalReq.quantity = quantity;
      await finalReq.save();
    } else {
      const newFinalReq = new FinalQuantity({
        state: state._id,
        district: district._id,
        product: product._id,
        month,
        quantity,
      });
      await newFinalReq.save();
    }
    return res.status(201).json({
      success: true,
      message: "Data saved successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
