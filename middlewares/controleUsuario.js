exports.ehAutenticado = function (req, res, next) {
  if (req.isAuthenticated()) return next();
  return res.redirect("/usuarios/login");
};

exports.ehAdmin = function (req, res, next) {
  if (req.user && req.user.perfil === "admin") return next();
  return res.status(403).render("error", {
    titulo_pagina: "Acesso negado",
    message: "Acesso negado: apenas Administradores.",
  });
};

exports.ehLojista = function (req, res, next) {
  if (req.user && req.user.perfil === "lojista") return next();
  return res.status(403).render("error", {
    titulo_pagina: "Acesso negado",
    message: "Acesso negado: apenas Lojistas.",
  });
};
