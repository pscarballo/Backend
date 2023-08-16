//@ts-check
import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const productEncontrados = "products";

// const productSchema = new Schema({
//   id: String,
//   title: String,
//   description: String,
//   price: Number,
//   thumbnail: String,
//   code: String,
//   stock: Number,
// });

// class ProductModel {
// getAll() {
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
// return productEncontrados;
//   }
// }
export const productModel = model("products", productSchema);
// // // productSchema.plugin(mongoosePaginate);
// // // const ProductModel = model(productCollection, productSchema);
// // // export const productModel = new ProductModel();

// new ProductModel();

// model("products", productSchema);
