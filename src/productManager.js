import fs from "fs";

class ProductManager {
  constructor(path) {
    // this.path = path;
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

  async addProduct(newProduct) {
    let allProducts = await this.getProducts();
    // let allProducts = await this.read(this.path);
    let nextId = await this.getNextId(allProducts);
    newProduct.id = nextId;
    newProduct.status = true;
    allProducts.push(newProduct);
    await this.write(allProducts);
    return newProduct;
  }

  async updateProduct(id, newProduct) {
    let allProducts = await this.getProducts();
    const productToUpdate = allProducts.find((product) => product.id == id);
    if (!productToUpdate) {
      console.log("producto no encontrado", productToUpdate);
      return {
        status: "error",
        msg: "Sorry, no product found by id: " + id,
        data: {},
      };
    }
    newProduct = this.updateProductFields(productToUpdate, newProduct);
    const index = allProducts.indexOf(productToUpdate);
    allProducts[index] = newProduct;
    await this.write(allProducts);
    return newProduct;
  }

  async deleteProduct(id) {
    let allProducts = await this.getProducts();
    const productToDelete = allProducts.find((product) => product.id == id);
    // return console.log(allProducts);
    if (!productToDelete) {
      return {
        status: "error",
        msg: "No product found by id: " + id,
        data: {},
      };
    }
    const index = allProducts.indexOf(productToDelete);
    allProducts.splice(index, 1);
    await this.write(allProducts);
    return productToDelete;
  }

  //***************************************************************************************************************************************** */
  updateProductFields(productToUpdate, newProduct) {
    const updatedProduct = {
      ...productToUpdate,
      ...newProduct,
    };
    return updatedProduct;
  }

  async write(allProducts) {
    let allProductsString = JSON.stringify(allProducts);
    try {
      await fs.promises.writeFile(this.path, allProductsString);
    } catch (err) {
      console.log("Error en la escritura", err);
    }
  }

  async getNextId(allProducts) {
    let lastId = 0;
    const allIdsArray = allProducts.map((product) => product.id);
    allIdsArray.filter((id) => typeof id === "number");
    if (allIdsArray.length > 0) {
      lastId = Math.max(...allIdsArray);
    }
    return lastId + 1;
  }
}

export default ProductManager;
