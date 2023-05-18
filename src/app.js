import express from "express";
import { productRouter } from "./routers/product.router.js";
import { cartRouter } from "./routers/cart.router.js";
import { handlebarsRouter } from "./routers/handlebars.routers.js";
import { realTimeProductsRoutes } from "./routers/realtimeproducts.router.js";

import handlebars from "express-handlebars";
import { __dirname } from "./utils.js";
import path from "path";
import { Server } from "socket.io";

const app = express();
const PORT = 8080;

const httpServer = app.listen(PORT, () => {
  console.log(`Example app listening on http://localhost:${PORT}`);
});

const socketServer = new Server(httpServer);

socketServer.on("connection", (socket) => {
  console.log(`New Client Connection with ID: ${socket.id}`);

  socket.on("new-product", async (newProd) => {
    try {
      await productManager.addProduct({ ...newProd });

      // Actualizando lista despues de agregar producto nuevo
      const productsList = await productManager.getProducts();

      socketServer.emit("products", { productsList });
    } catch (error) {
      console.log(error);
    }
  });
});

// socketServer.on("connection", (socket) => {
//   console.log("se abrio un canal de socket " + socket.id);
// });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/", handlebarsRouter);
app.use("/realtimeproducts", realTimeProductsRoutes);

//---------------------------------------------------------------------------------------------------------------------
// socketServer.on("connection", (socket) => {
//   console.log(`New Client Connection with ID: ${socket.id}`);

//   socket.on("new-product", async (newProd) => {
//     try {
//       await productManager.addProduct({ ...newProd });

//       // Actualizando lista despues de agregar producto nuevo
//       const productsList = await productManager.getProducts();

//       socketServer.emit("products", { productsList });
//     } catch (error) {
//       console.log(error);
//     }
//   });
// });
//--------------------------------------------------------------------------------------------------------------------------------------------------
app.get("*", (req, res) => {
  return res.status(404).json({
    status: "Error Catch All",
    msg: " Not Found",
    data: {},
  });
});
