import { CartService } from "../services/cart.service.js";
const Service = new CartService();

class CartController {
  getAllCarts = async (req, res) => {
    const queryParams = req.query;
    const response = await Service.getAllCarts(queryParams);
    return res.json({
      status: "si",
      payload: response,
    });
  };

  purchaseCart = async (req, res) => {
    const id = req.params.cid;
    const cartList = req.body;
    const infoUser = new userDTO(req.session);
    const response = await ticketsServices.purchaseCart(
      id,
      cartList,
      infoUser.email,
      infoUser.cartID
    );
    return res.status(response.status).json(response.result);
  };

  getTicketById = async (req, res) => {
    const id = req.params.cid;

    const response = await ticketsServices.getTicketById(id);
    return res.render("ticket", { ticket: response.result });
  };

  // status(response.status).json(response.result);
  // };
  // // //   async function(req, res) {
  // // //     try {
  // // //       const carts = await Service.getAllCarts();
  // // //       return res.status(200).json(carts);
  // // //     } catch (error) {
  // // //       res.status(400).json({ error: "Server error - cartRouter.get" });
  // // //     }
  // // //   }
}

export const cartController = new CartController();
