import express from "express";
import ProductManager from "../productManagr.js";

const productManager = new ProductManager();

export const realTimeProductsRoutes = express.Router();

// const realTimeProductsRoutes = express.Router();

// const express = require("express");
// const ProductManager = require("../ProductManager");
// const dataProd = new ProductManager("productsDB");

realTimeProductsRoutes.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    return res.render("realTimeProducts", { products: products });
  } catch (error) {
    res.status(500).json({
      succes: "false",
      msg: "Error",
      data: {},
    });
  }
});

// realTimeProdRoutes.get("/", async (req, res) => {
//   try {
//     const products = await dataProd.getProducts();
//     return res.render("realTimeProducts", { products: products });
//   } catch (error) {
//     res.status(500).json({ succes: "false", msg: "Error", payload: {} });
//   }
// });

// module.exports = realTimeProdRoutes;
