import fs from "fs";

class ProductManager {
  constructor() {
    // this.path = file;
    this.path = "./src/products.json";
  }

  async getProducts() {
    try {
      if (fs.existsSync(this.path)) {
        const data = await fs.promises.readFile(this.path, "utf-8");
        return JSON.parse(data);
      }
      await fs.promises.writeFile(this.path, JSON.stringify([])); //corregir el this.path por la ruta correcta de ubicacion de json
      return [];
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getProductById(id) {
    try {
      let data = await this.getProducts();
      const productFound = data.find((product) => product.id === id);

      if (!productFound) {
        return res.json("ID: " + id + " not found");
      }
      return productFound;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
export default ProductManager;
