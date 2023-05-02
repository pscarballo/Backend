import express from "express";
import ProductManager from "./productManager.js";
const productManager = new ProductManager();

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/products/", async (req, res) => {
  try {
    const limit = req.query.limit;
    const products = await productManager.getProducts();
    if (limit) {
      return res.json(products.slice(0, limit));
    } else {
      return res.json(products);
    }
  } catch (error) {
    return res.json({ message: "error" });
  }
});

app.get("/products/:pid", async (req, res) => {
  try {
    const id = req.params.pid;
    const product = await productManager.getProductById(parseInt(id));
    if (product) {
      return res.json(product);
    } else {
      return res.json({ error: "Not Found" });
    }
  } catch (error) {
    return res.json({ message: "ID not Found" });
  }
});

app.listen(PORT, () => {
  console.log("Listening on port http://localhost:${PORT}");
});
