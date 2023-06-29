import express from "express";
// import CartManager from "./../cartManager.js";
// const cartManager = new CartManager();
import { CartService } from "../services/cart.service.js";
import { ProductService } from "../services/products.service.js";

export const cartRouter = express.Router();
const cartService = new CartService();
const productService = new ProductService();

cartRouter.get("/", async function (req, res) {
  try {
    const carts = await cartService.getCarts();

    return res.status(200).json(carts);
  } catch (error) {
    res.status(400).json({ error: "Server error - cartRouter.get" });
  }
});

cartRouter.post("/", async (req, res) => {
  try {
    const newCart = req.body;
    const cartCreated = await cartService.addCart(newCart);
    if (cartCreated) {
      return res.status(201).json({
        status: "success",
        data: cartCreated,
      });
    } else {
      return res.json({
        status: "error",
      });
    }
  } catch (err) {
    res.status(err.status || 500).json({
      status: "error",
      payload: err.message,
    });
  }
});

cartRouter.get("/:idCart/carts", async (req, res) => {
  try {
    const idCart = req.params.idCart;
    const allCarts = await cartService.read();
    const cart = allCarts.find((cart) => cart.id == idCart);

    if (cart) {
      res.status(200).json({
        status: "success carts",
        payload: cart,
      });
    } else {
      res.status(404).json({
        status: "error",
        message: "Sorry, no cart found by id: " + idCart,
        payload: {},
      });
    }
  } catch (err) {
    res.status(err.status || 500).json({
      status: "error",
      data: err.message,
    });
  }
});

cartRouter.put("/:idCart/products/:idProduct", async (req, res) => {
  try {
    const idCart = req.params.idCart;
    const idProduct = req.params.idProduct;
    const cartUpdated = await cartService.addProductToCart(idCart, idProduct);
    if (cartUpdated) {
      res.status(200).json({
        status: "success",
        data: cartUpdated,
      });
    } else {
      res.status(404).json({
        status: "error",
        message: "Sorry, could not add product to cart 1",
        data: {},
      });
    }
  } catch (err) {
    res.status(err.status || 500).json({
      status: "error de aca",
      payload: err.message,
    });
  }
});
