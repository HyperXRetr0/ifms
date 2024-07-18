import { Request, Response } from "express";
import State from "../models/states";
import District from "../models/districts";
import Product from "../models/product";

export const createState = async (req: Request, res: Response) => {
  try {
    let state = await State.findOne({ state: req.body.state });
    if (state) {
      return res.status(400).json({
        success: false,
        message: "State already exists",
      });
    }
    state = new State(req.body);
    await state.save();
    return res.status(201).json({
      success: true,
      state,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something Went Wrong",
    });
  }
};

export const createDistrict = async (req: Request, res: Response) => {
  try {
    const state = await State.findOne({ state: req.body.state });
    if (!state) {
      return res.status(400).json({
        success: false,
        message: "State doesn't exists",
      });
    }
    const { district } = req.body;
    const isDistrict = await District.findOne({ district });
    if (isDistrict) {
      return res.status(400).json({
        success: false,
        message: "District already exists",
      });
    }
    const districtResponse = {
      state: state._id,
      district,
    };
    const district_new = new District(districtResponse);
    await district_new.save();
    return res.status(201).json({
      success: true,
      districtResponse,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};

export const deleteAllDistricts = async (req: Request, res: Response) => {
  try {
    await District.deleteMany({});
    return res.status(200).json({
      success: true,
      message: "All Districts Deleted",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    let product = await Product.findOne({ product: req.body.product });
    if (product) {
      return res.status(400).json({
        success: false,
        message: "Product already exists",
      });
    }
    product = new Product(req.body);
    await product.save();
    return res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
