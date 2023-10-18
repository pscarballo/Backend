import express from 'express';
export const cartsApiRouter = express.Router();
import { cartsController } from '../controllers/carts.controller.js';
import { ticketsController } from '../controllers/tickets.controller.js';
import { checkCart, checkUser, checkLogin } from '../middlewares/main.js';

cartsApiRouter.get('/:cid', checkLogin, checkCart, cartsController.readByRender);
cartsApiRouter.post('/:cid/products/:pid', checkCart, checkUser, cartsController.addProduct);
cartsApiRouter.put('/:cid/products/:pid', cartsController.updateProductQuantity);
cartsApiRouter.delete('/:cid/products/:pid', cartsController.deleteProduct);
cartsApiRouter.delete('/:cid', cartsController.emptyCart);

cartsApiRouter.post('/:cid/purchase', checkCart, checkUser, ticketsController.create);
