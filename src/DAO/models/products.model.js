import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

// const productSchema = new Schema({
//   id: String,
//   title: String,
//   description: String,
//   price: Number,
//   thumbnail: String,
//   code: String,
//   stock: Number,
// });

// export const ProductsModel = model("products", productSchema);

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    default: 0,
    required: true,
  },
  stock: {
    type: Number,
    default: 0,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: true,
  },
  thumbnail: {
    //array de strings
    type: [String],
  },
});
export const ProductModel = model("products", productSchema);
