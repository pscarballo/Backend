import { Schema, model } from "mongoose";

const schemaCart = new Schema(
  {
    products: {
      type: [
        {
          product: {
            type: Schema.Types.ObjectId,
            ref: "products",
          },
          quantity: {
            type: Number,
            min: 1,
            default: 1,
          },
        },
      ],
      default: [],
    },
  },
  {
    versionKey: false,
  }
);
export const CartsModel = model("carts", schemaCart);
// import { Schema, model } from "mongoose";

// const productSchema = new Schema({
//   id: String,
//   products: Array,
// });

// export const CartsModel = model("carts", productSchema);
