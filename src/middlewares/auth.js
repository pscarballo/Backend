export function isUser(req, res, next) {
  if (req.session?.email) {
    return next();
  }
  return res.status(401).render("error", { error: "error de autenticacion!" });
}

export function isAdmin(req, res, next) {
  if (req.session?.isAdmin) {
    return next();
  }
  return res.status(403).render("error", { error: "error de autorización!" });
}

export function isCartOwner(req, res, next) {
  if (req.session?.cartID === req.params.cid) {
    return next();
  }
  return res.status(403).render("error", { error: "Error de autorización." });
}
