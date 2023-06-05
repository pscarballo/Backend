import { Schema, model } from "mongoose";

const productSchema = new Schema({
  id: String,
  title: String,
  description: String,
  price: Number,
  thumbnail: String,
  code: String,
  stock: Number,
});

export const ProductsModel = model("products", productSchema);
