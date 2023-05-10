import express from "express";
import ProductManager from "./../productManager.js";
// const path = "./scr/products.json";
const productManager = new ProductManager();

export const productRouter = express.Router();

productRouter.get("/", async (req, res) => {
  try {
    const limit = req.query.limit;
    const products = await productManager.getProducts();
    if (limit) {
      return res.status(200).json({
        status: "Success",
        msg: " Products List",
        data: products.slice(0, limit),
      });
      //   return res.json(products.slice(0, limit));
    } else {
      return res.status(200).json({
        status: "Success",
        msg: " Products List",
        data: products,
      });
      //   return res.json(products);
    }
  } catch (error) {
    return res.status(500).json({
      status: "Error",
      msg: "error",
      data: {},
    });
    // return res.json({ message: "error" });
  }
});

productRouter.get("/:pid", async (req, res) => {
  try {
    const id = req.params.pid;
    const product = await productManager.getProductById(parseInt(id));
    if (product) {
      return res.status(200).json({
        status: "Success",
        msg: " Products List",
        data: product,
      });
      //   return res.json(product);
    } else {
      return res.status(500).json({
        status: "Error",
        msg: "Not Found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: "Error",
      msg: "ID Not Found",
    });
    // return res.json({ message: "ID not Found" });
  }
});

productRouter.post("/", async (req, res) => {
  try {
    const newProduct = req.body;
    const productCreated = await productManager.addProduct(newProduct);

    if (productCreated) {
      return res.status(201).json({
        status: "Success",
        msg: " Products Created",
        data: productCreated,
      });
    } else {
      return res.status(500).json({
        status: "Error",
        msg: "",
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "error",
      msg: "aca estoy",
    });
  }
});

productRouter.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const newProduct = req.body;
    const productUpdated = await productManager.updateProduct(id, newProduct);
    if (productUpdated) {
      res.status(200).json({
        status: "success",
        data: productUpdated,
      });
    } else {
      return res.status(500).json({
        status: "Error",
        msg: "el del else",
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "error",
      msg: "No se Elimino",
    });
  }
});

productRouter.delete("/:id", async (req, res) => {
  try {
    console.log("delete");
    const id = req.params.id;
    const product = await productManager.getProductById(parseInt(id));

    if (!product) {
      res.status(404).json({
        status: "error",
        message: "Sorry, no product found by id: " + id,
        data: {},
      });
      return;
    }

    const productDeleted = await productManager.deleteProduct(id);
    res.status(200).json({
      status: "success",
      data: productDeleted,
    });
  } catch (err) {
    res.status(500).json({
      status: "error aca",
      data: err.message,
    });
  }
});
