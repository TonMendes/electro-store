const { Produto, Categoria } = require("../model/modelos");

exports.tela_principal = async function (req, res) {
  res.set("Cache-Control", "no-store");
  try {
    const produtos = await Produto.findAll({
      include: [{ model: Categoria, as: "categoria" }],
      order: [["id", "ASC"]],
    });
    const contexto = {
      titulo_pagina: "ElectroStore",
      produtos: produtos,
    };
    return res.render("index", contexto);
  } catch (error) {
    console.error("Erro ao listar produtos:", error);
    return res.status(500).send("Erro ao listar produtos");
  }
};

exports.nossa_historia = function (req, res) {
  res.set("Cache-Control", "public, max-age=26280000, no-cache");
  const contexto = { titulo_pagina: "Nossa História" };
  return res.render("nossa_historia", contexto);
};
