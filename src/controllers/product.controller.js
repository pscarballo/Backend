//@ts-check

import { productService } from "../routers/product.router.js";

class ProductController {
  getAll(req, res) {
    const productEncontrados = productService.getAll();
    return res.json({
      status: "success",
      payload: productEncontrados,
    });
  }
}
export const productController = new ProductController();
