import MongoStore from "connect-mongo";
import express from "express";
import handlebars from "express-handlebars";
import session from "express-session";
import path from "path";
import { authRouter } from "./routers/auth.router.js";
import { cartRouter } from "./routers/cart.router.js";
import { productRouter } from "./routers/product.router.js";
import { testSocketChatRouter } from "./routers/test.socket.chat.router.js";
import { __dirname, connectMongo, connectSocket } from "./utils.js";
import { iniPassport } from "./config/passport.config.js";
import { sessionsRouter } from "./routes/sessions.router.js";
import { viewsRouter } from "./routes/views.router.js";
import passport from "passport";

const app = express();
const PORT = 8080;

const httpServer = app.listen(PORT, () => {
  console.log(`🚀 App listening on http://localhost:${PORT}`);
});

connectMongo();
connectSocket(httpServer);

//Config Express

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");

app.use(
  session({
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://pscarballo:qknq427loygdxEe5@mongocoder.quijugq.mongodb.net/ecommerce",
      ttl: 7200,
    }),
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

//Passport
iniPassport();
app.use(passport.initialize());
app.use(passport.session());
// app.use(passport.initialize());
// app.use(passport.session());

//Rutas
app.use("/api/sessions", sessionsRouter);
app.use("/", viewsRouter);
// app.use("/products", productRouter);
// app.use("/carts", cartRouter);
// app.use("/test-chat", testSocketChatRouter);
app.use("/auth", authRouter);

app.get("*", (req, res) => {
  return res.status(404).json({
    status: "Error Catch All",
    msg: " Not Found",
    data: {},
  });
});
