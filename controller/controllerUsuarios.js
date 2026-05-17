const passport = require("passport");
const bcrypt = require("bcrypt");
const { Usuario } = require("../model/modelos");

const regex_email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

exports.login_get = function (req, res) {
  const contexto = { titulo_pagina: "Login" };
  res.render("usuario/login", contexto);
};

exports.login_post = function (req, res, next) {
  passport.authenticate("local", (err, user, info) => {
    if (err) return res.status(500).send("Erro ao autenticar");
    if (!user) {
      const contexto = {
        titulo_pagina: "Login",
        errors: [
          {
            msg: info && info.message ? info.message : "Credenciais inválidas",
          },
        ],
        old: { email: req.body.email },
      };
      return res.status(401).render("usuario/login", contexto);
    }
    req.login(user, (err) => {
      if (err) return res.status(500).send("Erro ao fazer login");
      return res.redirect("/");
    });
  })(req, res, next);
};

exports.logout = function (req, res) {
  req.logout((err) => {
    if (err) return res.status(500).send("Erro ao fazer logout");
    return res.redirect("/");
  });
};

exports.cria_get = function (req, res) {
  res.set("Cache-Control", "private, max-age=31536000, immutable");
  const contexto = { titulo_pagina: "Cadastro de Usuário" };
  res.render("usuario/cria_usuario", contexto);
};

exports.cria_post = async function (req, res) {
  const novo_usuario = {
    nome: (req.body.nome || "").trim(),
    email: (req.body.email || "").trim().toLowerCase(),
    senha: req.body.senha || "",
    confirma_senha: req.body.confirma_senha || "",
  };

  const errors = [];

  if (!novo_usuario.nome) {
    errors.push({ msg: "Nome é obrigatório" });
  }
  if (!novo_usuario.email) {
    errors.push({ msg: "E-mail é obrigatório" });
  } else if (!regex_email.test(novo_usuario.email)) {
    errors.push({ msg: "E-mail inválido" });
  }
  if (!novo_usuario.senha || novo_usuario.senha.length < 6) {
    errors.push({ msg: "Senha deve ter no mínimo 6 caracteres" });
  }
  if (novo_usuario.senha !== novo_usuario.confirma_senha) {
    errors.push({ msg: "As senhas não coincidem" });
  }

  if (errors.length > 0) {
    const contexto = {
      titulo_pagina: "Cadastro de Usuário",
      errors: errors,
      old: { nome: novo_usuario.nome, email: novo_usuario.email },
    };
    return res.status(400).render("usuario/cria_usuario", contexto);
  }

  try {
    const usuario_existente = await Usuario.findOne({
      where: { email: novo_usuario.email },
    });
    if (usuario_existente) {
      const contexto = {
        titulo_pagina: "Cadastro de Usuário",
        errors: [{ msg: "E-mail já cadastrado" }],
        old: { nome: novo_usuario.nome, email: novo_usuario.email },
      };
      return res.status(400).render("usuario/cria_usuario", contexto);
    }

    const senha_hash = await bcrypt.hash(novo_usuario.senha, 10);
    await Usuario.create({
      nome: novo_usuario.nome,
      email: novo_usuario.email,
      senha_hash: senha_hash,
      perfil: "usuario",
    });

    return res.redirect("/usuarios/login");
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error);
    return res.status(500).send("Erro ao cadastrar usuário");
  }
};
