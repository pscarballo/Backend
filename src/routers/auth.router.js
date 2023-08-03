import express from "express";
import passport from "passport";
import { isAdmin, isUser } from "../middlewares/auth.js";

export const authRouter = express.Router();

authRouter.get("/session", (req, res) => {
  return res.send(JSON.stringify(req.session));
});

authRouter.get("/register", (req, res) => {
  return res.render("register", {});
});

authRouter.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/auth/failregister" }),
  (req, res) => {
    if (!req.user) {
      return res.json({ error: "something went wrong" });
    }
    req.session.user = {
      _id: req.user._id,
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      isAdmin: req.user.isAdmin,
      rol: req.user.rol,
    };

    return res.json({ msg: "ok", payload: req.user });
  }
);

authRouter.get("/failregister", async (req, res) => {
  return res.json({ error: "fail to register" });
});

authRouter.get("/login", (req, res) => {
  return res.render("login", {});
});

authRouter.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/auth/faillogin" }),
  async (req, res) => {
    if (!req.user) {
      return res.json({ error: "invalid credentials" });
    }
    req.session.user = {
      _id: req.user._id,
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      isAdmin: req.user.isAdmin,
      rol: req.user.rol,
    };

    return res.json({ msg: "ok", payload: req.user });
  }
);

// authRouter.post("/login", async (req, res) => {
//   const { email, pass } = req.body;
//   if (!email || !pass) {
//     return res.status(400).render("error", { error: "ponga su email y pass" });
//   }
//   const usarioEncontrado = await UserModel.findOne({ email: email });
//   if (usarioEncontrado && isValidPassword(pass, usarioEncontrado.pass)) {
//     req.session.email = usarioEncontrado.email;
//     req.session.isAdmin = usarioEncontrado.isAdmin;

//     return res.redirect("/auth/perfil");
//   } else {
//     return res.status(401).render("error", { error: "email o pass estan mal" });
//   }
// });

authRouter.get("/faillogin", async (req, res) => {
  return res.json({ error: "fail to login" });
});

authRouter.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res
        .status(500)
        .render("error", { error: "no se pudo cerrar su session" });
    }
    return res.redirect("/auth/login");
  });
});

authRouter.get("/perfil", isUser, (req, res) => {
  const user = { email: req.session.email, isAdmin: req.session.isAdmin };
  return res.render("perfil", { user: user });
});

authRouter.get("/administracion", isUser, isAdmin, (req, res) => {
  return res.render("console", {});
});

// authRouter.post("/register", async (req, res) => {
//   const { email, pass, firstName, lastName } = req.body;
//   if (!email || !pass || !firstName || !lastName) {
//     return res.status(400).render("error", { error: "Incorrect Data" });
//   }
//   try {
//     await UserModel.create({
//       email: email,
//       pass: createHash(pass),
//       firstName: firstName,
//       lastName: lastName,
//       isAdmin: false,
//     });
//     req.session.email = email;
//     req.session.isAdmin = false;

//     return res.redirect("/auth/perfil");
//   } catch (e) {
//     console.log(e);
//     return res.status(400).render("error", {
//       error: "no se pudo crear el usuario. Intente con otro mail.",
//     });
//   }
// });
