//Multer---------------------------------------------------------------------------
import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "public"));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

export const uploader = multer({ storage });

//__Dirname---------------------------------------------------------------------------
import path from "path";
import { fileURLToPath } from "url";
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

//MONGO---------------------------------------------------------------------------------------
import { connect, Schema, model } from "mongoose";
import faker from "faker";
// import { ProductModel } from "./DAO/models/products.model.js";
export async function connectMongo() {
  try {
    await connect(
      /* PONER TU STRING ENTERO ACA */
      "mongodb+srv://pscarballo:qknq427loygdxEe5@mongocoder.quijugq.mongodb.net/ecommerce"
    );
    console.log("🖥️  Plug to Mongo!");
  } catch (e) {
    console.log(e);
    throw "can not connect to the db";
  }
}

//SOCKET------------------------------------------------------------------------------
import { Server } from "socket.io";
import { MsgModel } from "./DAO/models/msgs.model.js";
import { ProductModel } from "./DAO/models/products.model.js";
import { CartsModel } from "./DAO/models/carts.model.js";
export function connectSocket(httpServer) {
  const socketServer = new Server(httpServer);

  socketServer.on("connection", (socket) => {
    socket.on("msg_front_to_back", async (msg) => {
      const msgCreated = await MsgModel.create(msg);
      const msgs = await MsgModel.find({});
      socketServer.emit("msg_back_to_front", msgs);
    });
  });
}
