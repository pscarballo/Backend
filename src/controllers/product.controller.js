import { ProductService } from "../services/products.service.js";
const Service = new ProductService();

class ProductController {
  getAll = async (req, res) => {
    const queryParams = req.query;
    const response = await Service.getAll(queryParams);
    return res.json({
      status: "Successful",
      payload: response,
    });

    // status(response.status).json(response.result);
  };
  // // // getAll(req, res) {
  // // //   const params = req.query;
  // // //   const result = ProductService.getAll(params);
  // // //   return res.json({
  // // //     status: "success aca",
  // // //     payload: result,
  // // //   });
  // // // }
}
export const productController = new ProductController();
