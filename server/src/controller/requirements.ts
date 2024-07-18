import { Request, Response } from "express";
import State from "../models/states";
import District from "../models/districts";
import Product from "../models/product";
import Requirement from "../models/requirement";
import { saveToDac } from "../utils/utils";

interface MonthTotals {
  [month: string]: number;
}

type GetResponseType = {
  state: string;
  product: string;
  districts: {
    district: string;
    monthlyQuantities: {
      [month: string]: number;
    };
  }[];
  monthTotals: MonthTotals;
};

export const getRequirements = async (req: Request, res: Response) => {
  try {
    const {
      state: stateName,
      monthGroup,
      product: productName,
      year,
    } = req.query;

    const state = await State.findOne({ state: stateName });
    const product = await Product.findOne({ product: productName });

    if (!state || !product) {
      return res.status(404).json({
        success: false,
        message: "State or product not found",
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
    const currentDate = new Date();
    const districts = await District.find({ state: state._id });
    const requirements = await Requirement.aggregate([
      {
        $match: {
          state: state._id,
          product: product._id,
          month: { $in: months },
          createdAt: {
            $gte: new Date(
              `${startYear}-${currentDate.getMonth()}-${currentDate.getDate()}`
            ),
            $lte: new Date(
              `${endYear}-${
                currentDate.getMonth() - 1
              }-${currentDate.getDate()}`
            ),
          },
        },
      },
      {
        $group: {
          _id: { district: "$district", month: "$month" },
          totalQuantity: { $sum: "$quantity" },
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
        $project: {
          _id: 0,
          district: "$district.district",
          month: "$_id.month",
          totalQuantity: 1,
        },
      },
      {
        $sort: { district: 1 },
      },
    ]);

    const districtMap = new Map<string, any>();
    const monthTotals: { [key: string]: number } = {};

    districts.forEach((district) => {
      const districtData: any = {
        district: district.district,
        monthlyQuantities: {},
      };
      months.forEach((month) => {
        districtData.monthlyQuantities[month] = 0;
        monthTotals[month] = 0; // Initialize month totals
      });
      districtMap.set(district.district, districtData);
    });
    requirements.forEach(async (req) => {
      const districtData = districtMap.get(req.district);
      if (districtData) {
        districtData.monthlyQuantities[req.month] = req.totalQuantity;
        monthTotals[req.month] += req.totalQuantity;
      }
    });

    const result: GetResponseType = {
      state: state.state,
      product: product.product,
      districts: Array.from(districtMap.values()),
      monthTotals,
    };

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const addRequirements = async (req: Request, res: Response) => {
  try {
    const { state, district, product, month, quantity } = req.body;
    const stateDoc = await State.findOne({ state });
    const districtDoc = await District.findOne({ district });
    const productDoc = await Product.findOne({ product });

    if (!stateDoc || !districtDoc || !productDoc) {
      return res.status(404).json({
        success: false,
        message: "State, District, or Product not found",
      });
    }

    const existingRequirement = await Requirement.findOne({
      state: stateDoc._id,
      district: districtDoc._id,
      product: productDoc._id,
      month,
    });

    if (existingRequirement) {
      existingRequirement.quantity = quantity;
      await existingRequirement.save();
    } else {
      const newRequirement = new Requirement({
        state: stateDoc._id,
        district: districtDoc._id,
        product: productDoc._id,
        month,
        quantity,
      });
      await newRequirement.save();
    }
    const data = {
      state: stateDoc._id,
      product: productDoc._id,
      month,
      quantity,
    };
    await saveToDac(data);

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

export const deleteAllRequirementDoc = async (req: Request, res: Response) => {
  try {
    await Requirement.deleteMany({});
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
