import express from "express";
import { ProductService } from "../services/products.service.js";
// import { ProductModel } from "../DAO/models/products.model.js";
// import ProductManager from "./../productManager.js";
// const path = "./scr/products.json";
export const productRouter = express.Router();
export const productService = new ProductService();

productRouter.get("/", async function (req, res) {
  try {
    const limit = req.query.limit;
    const products = await productService.getProducts();
    if (!limit) {
      return res.status(200).render("home", { products });
    }
    // AGREGAR CON LIMIT
  } catch (error) {
    res.status(400).json({ message: "Server error - productsRouter.get" });
  }
});
productRouter.get("/:id", async function (req, res) {
  try {
    const id = req.params.id;
    const product = await productService.getProductById(id);

    if (!product.length) {
      return res.status(404).json({ error: `Product id '${id}' not found` });
    }
    return res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ error: "Server error - productsRouter.get" });
  }
});
productRouter.post("/", async function (req, res) {
  try {
    const product = req.body;
    const productCreated = await productService.addProduct(product);
    return res.status(201).json({
      status: "success",
      msg: "user created",
      data: productCreated,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "error",
      msg: "Server error - productsRouter.post",
      data: {},
    });
  }
});
productRouter.put("/:id", async function (req, res) {
  try {
    const id = req.params.id;
    const productUpdate = req.body;
    const productExists = await productService.getProductById(id);

    if (!productExists.length) {
      return res.status(404).json({ error: `Product id '${id}' not found` });
    }
    const product = await productService.updateProduct(id, productUpdate);
    if (product) {
      return res.status(201).json({
        status: "success",
        msg: "Product updated",
        data: product,
      });
    } else {
      res.status(400).json({
        error: "The product could not be updated. Plase verify and try again",
      });
    }
  } catch (error) {
    res.status(400).json({ error: "Server error - productsRouter.put" });
  }
});
productRouter.delete("/:id", async function (req, res) {
  try {
    const id = req.params.id;

    if (await productService.deleteProduct(id)) {
      return res.status(201).json({
        status: "success",
        msg: "Product deleted",
        data: `id: '${id}'`,
      });
    } else {
      res.status(400).json({
        error: "The product could not be deleted. Plase verify and try again",
      });
    }
  } catch (error) {
    res.status(400).json({ error: "Server error - productsRouter.delete" });
  }
});

// export const productRouter = express.Router();
// // const productManager = new ProductManager();
// const db = new ProductService();

// productRouter.get("/", async (req, res) => {
//   try {
//     const limit = req.query.limit;
//     const products = await db.getProducts();
//     if (limit) {
//       return res.status(200).render("home", { products });
//       // ({
//       //   status: "Success",
//       //   msg: " Products List",
//       //   data: products.slice(0, limit),
//       // });
//     } else {
//       return res.status(200).json({
//         status: "Success",
//         msg: " Products List",
//         data: products,
//       });
//     }
//   } catch (error) {
//     return res.status(500).json({
//       status: "Error",
//       msg: "Este error",
//       data: {},
//     });
//     // return res.json({ message: "error" });
//   }
// });

// productRouter.get("/:pid", async (req, res) => {
//   try {
//     const id = req.params.pid;
//     const product = await productManager.getProductById(parseInt(id));
//     if (product) {
//       return res.status(200).json({
//         status: "Success",
//         msg: " Products List",
//         data: product,
//       });
//       //   return res.json(product);
//     } else {
//       return res.status(500).json({
//         status: "Error",
//         msg: "Not Found",
//       });
//     }
//   } catch (error) {
//     return res.status(500).json({
//       status: "Error",
//       msg: "ID Not Found",
//     });
//     // return res.json({ message: "ID not Found" });
//   }
// });

// productRouter.post("/", async (req, res) => {
//   try {
//     const newProduct = req.body;
//     const productCreated = await productManager.addProduct(newProduct);

//     if (productCreated) {
//       return res.status(201).json({
//         status: "Success",
//         msg: " Products Created",
//         data: productCreated,
//       });
//     } else {
//       return res.status(500).json({
//         status: "Error",
//         msg: "",
//       });
//     }
//   } catch (err) {
//     res.status(500).json({
//       status: "error",
//       msg: "aca estoy",
//     });
//   }
// });

// productRouter.put("/:id", async (req, res) => {
//   try {
//     const id = req.params.id;
//     const newProduct = req.body;
//     const productUpdated = await productManager.updateProduct(id, newProduct);
//     if (productUpdated) {
//       res.status(200).json({
//         status: "success",
//         data: productUpdated,
//       });
//     } else {
//       return res.status(500).json({
//         status: "Error",
//         msg: "el del else",
//       });
//     }
//   } catch (err) {
//     res.status(500).json({
//       status: "error",
//       msg: "No se Elimino",
//     });
//   }
// });

// productRouter.delete("/:id", async (req, res) => {
//   try {
//     console.log("delete");
//     const id = req.params.id;
//     const product = await productManager.getProductById(parseInt(id));

//     if (!product) {
//       res.status(404).json({
//         status: "error",
//         message: "Sorry, no product found by id: " + id,
//         data: {},
//       });
//       return;
//     }

//     const productDeleted = await productManager.deleteProduct(id);
//     res.status(200).json({
//       status: "success",
//       data: productDeleted,
//     });
//   } catch (err) {
//     res.status(500).json({
//       status: "error aca",
//       data: err.message,
//     });
//   }
// });
