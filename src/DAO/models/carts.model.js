import { Schema, model } from "mongoose";

const productSchema = new Schema({
  id: String,
  products: Array,
});

export const CartsModel = model("carts", productSchema);
