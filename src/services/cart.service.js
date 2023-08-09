import { CartsModel } from "../models/carts.model.js";

export class CartService {
  async getAllCarts() {
    const carts = await CartsModel.find();
    return carts;
  }

  async getCartById(_id) {
    const cart = await CartsModel.find({ _id: _id }).populate(
      "products.product"
    );
    return cart;
  }

  async addCart() {
    const cartCreated = await CartsModel.create({});
    return cartCreated;
  }

  async addCartProduct(cartId, productId) {
    const cart = await CartsModel.findOne({ _id: cartId }).populate(
      "products.product"
    );
    console.log(cart);

    let pIndex = cart.products.findIndex((cart) =>
      cart.product.equals(productId)
    ); // Finding index product in cart
    console.log(pIndex);
    if (pIndex !== -1) {
      // Product exists
      const quantity = cart.products[pIndex].quantity++;
      // Restar stock del producto    ////////////////////////////////////////
      await cart.save();
      return await this.getCartById(cartId);
    }
    cart.products.push({ product: productId }); // Product does not exists
    const cartUpdated = await CartsModel.updateOne({ _id: cartId }, cart);
    return await this.getCartById(cartId);
  }
}
