import express from "express";
import { productRouter } from "./routers/product.router.js";
import { cartRouter } from "./routers/cart.router.js";

// import ProductManager from "./productManager.js";
// const productManager = new ProductManager();

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);

// app.get("/products/", async (req, res) => {
//   try {
//     const limit = req.query.limit;
//     const products = await productManager.getProducts();
//     if (limit) {
//       return res.json(products.slice(0, limit));
//     } else {
//       return res.json(products);
//     }
//   } catch (error) {
//     return res.json({ message: "error" });
//   }
// });

// app.get("/products/:pid", async (req, res) => {
//   try {
//     const id = req.params.pid;
//     const product = await productManager.getProductById(parseInt(id));
//     if (product) {
//       return res.json(product);
//     } else {
//       return res.json({ error: "Not Found" });
//     }
//   } catch (error) {
//     return res.json({ message: "ID not Found" });
//   }
// });

app.listen(PORT, () => {
  console.log(`Listening on port http://localhost:${PORT}`);
});

app.get("*", (req, res) => {
  return res.status(404).json({
    status: "Error Catch All",
    msg: " Not Found",
    data: {},
  });
});
