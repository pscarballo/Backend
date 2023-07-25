import fs from "fs";

class CartManager {
  constructor(path) {
    // this.path = path;
    this.path = "./src/carts.json";
  }
  async addCart() {
    const allCarts = await this.read();
    const nextId = await this.getNextId(allCarts);
    const newCart = {
      id: nextId,
      products: [],
    };
    allCarts.push(newCart);
    await this.write(allCarts);
    return newCart;
  }

  async addProductToCart(idCart, idProduct) {
    const allCartsArray = await this.read();
    const cartToUpdate = allCartsArray.find((cart) => cart.id == idCart);

    if (!cartToUpdate) {
      return {
        status: "error",
        message: "Sorry, no cart found by id: " + idCart,
        payload: {},
      };
    }

    const data = await fs.promises.readFile("./src/products.json", "utf-8");
    const allProductsArray = JSON.parse(data);

    const productToAdd = allProductsArray.find(
      (product) => product.id == idProduct
    );

    if (!productToAdd) {
      return {
        status: "error",
        message: "Sorry, no product found by id: " + idProduct,
        payload: {},
      };
    }

    const productAlreadyInCart = await this.findProductInCart(
      cartToUpdate,
      idProduct
    );

    if (productAlreadyInCart) {
      const index = cartToUpdate.products.indexOf(productAlreadyInCart);
      const productData = {
        id: productAlreadyInCart.id,
        quantity: productAlreadyInCart.quantity + 1,
      };
      cartToUpdate.products[index] = productData;
      const indexCart = allCartsArray.indexOf(cartToUpdate);
      allCartsArray[indexCart] = cartToUpdate;
      await this.write(allCartsArray);
      return cartToUpdate;
    }

    const productData = {
      id: productToAdd.id,
      quantity: 1,
    };
    cartToUpdate.products.push(productData);

    const index = allCartsArray.indexOf(cartToUpdate);
    allCartsArray[index] = cartToUpdate;
    await this.write(allCartsArray);
    return cartToUpdate;
  }

  //****************************************************************************************************************************************************** */
  async findProductInCart(cartToUpdate, idProduct) {
    return cartToUpdate.products.find((product) => product.id == idProduct);
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

  async read() {
    let allCartsArray = [];
    try {
      let allCartsString = await fs.promises.readFile(this.path, "utf-8");
      allCartsString.length > 0
        ? (allCartsArray = JSON.parse(allCartsString))
        : (allCartsArray = []);
    } catch (err) {
      console.log("Error en la lectura del archivo", err);
    }
    return allCartsArray;
  }

  async write(allCartsArray) {
    let allCartsString = JSON.stringify(allCartsArray);
    try {
      await fs.promises.writeFile(this.path, allCartsString);
    } catch (err) {
      console.log("Error en la escritura", err);
    }
  }
}
export default CartManager;
