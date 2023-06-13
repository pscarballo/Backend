import express from "express";
import { productRouter } from "./routers/product.router.js";
import { cartRouter } from "./routers/cart.router.js";
import { handlebarsRouter } from "./routers/handlebars.routers.js";
import { realTimeProductsRoutes } from "./routers/realtimeproducts.router.js";
import handlebars from "express-handlebars";
import path from "path";
import { __dirname, connectMongo, connectSocket } from "./utils.js";
import { testSocketChatRouter } from "./routers/test.socket.chat.router.js";

const app = express();
const PORT = 8080;

const httpServer = app.listen(PORT, () => {
  console.log(`Example app listening on http://localhost:${PORT}`);
});

connectMongo();
connectSocket(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");

app.use("/products", productRouter);
app.use("/carts", cartRouter);
// app.use("/", handlebarsRouter);
// app.use("/realtimeproducts", realTimeProductsRoutes);

//---------------------------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------------------------------------------------------------
//Rutas: SOCKETS
app.use("/test-chat", testSocketChatRouter);

app.get("*", (req, res) => {
  return res.status(404).json({
    status: "Error Catch All",
    msg: " Not Found",
    data: {},
  });
});
