import mongoose from "mongoose";

export type ProductType = {
  _id: string;
  product: string;
};

const productSchema = new mongoose.Schema<ProductType>({
  product: {
    type: String,
    required: true,
    unique: true,
  },
});

const Product = mongoose.model<ProductType>("Product", productSchema);
export default Product;
