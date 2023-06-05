import express from "express";
import ProductManager from "./../productManager.js";

const productManager = new ProductManager();

export const handlebarsRouter = express.Router();

handlebarsRouter.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    return res.render("home", { products: products });
  } catch (error) {
    res.status(500).json({
      succes: "false",
      msg: "Error",
      data: {},
    });
  }
});

// module.exports = hbsRoutes;
