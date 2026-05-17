const { Produto, Categoria } = require("../model/modelos");

exports.cria_get = async function (req, res) {
  res.set("Cache-Control", "private, max-age=5256000, no-cache");
  try {
    const categorias = await Categoria.findAll({ order: [["nome", "ASC"]] });
    const contexto = {
      titulo_pagina: "Cadastro de Produto",
      categorias: categorias,
    };
    return res.render("produto/cria_produto", contexto);
  } catch (error) {
    console.error("Erro ao carregar tela de cadastro de produto:", error);
    return res.status(500).send("Erro ao carregar tela de cadastro de produto");
  }
};

exports.cria_post = async function (req, res) {
  const novo_produto = {
    nome: (req.body.nome || "").trim(),
    preco: req.body.preco,
    descricao: (req.body.descricao || "").trim(),
    quantidade: req.body.quantidade,
    status: req.body.status,
    categoria_id: req.body.categoria_id,
    usuario_id: req.user.id,
  };

  const errors = [];

  if (!novo_produto.nome) {
    errors.push({ msg: "Nome é obrigatório" });
  }

  const preco_numero = Number(novo_produto.preco);
  if (!novo_produto.preco || isNaN(preco_numero) || preco_numero <= 0) {
    errors.push({ msg: "Preço deve ser um número positivo" });
  }

  if (!novo_produto.descricao) {
    errors.push({ msg: "Descrição é obrigatória" });
  }

  const quantidade_numero = Number(novo_produto.quantidade);
  if (
    novo_produto.quantidade === undefined ||
    novo_produto.quantidade === "" ||
    isNaN(quantidade_numero) ||
    !Number.isInteger(quantidade_numero) ||
    quantidade_numero < 0
  ) {
    errors.push({
      msg: "Quantidade deve ser um número inteiro maior ou igual a zero",
    });
  }

  if (novo_produto.status !== "ativo" && novo_produto.status !== "inativo") {
    errors.push({ msg: "Status inválido" });
  }

  const categoria_id_numero = Number(novo_produto.categoria_id);
  if (
    !novo_produto.categoria_id ||
    isNaN(categoria_id_numero) ||
    !Number.isInteger(categoria_id_numero) ||
    categoria_id_numero <= 0
  ) {
    errors.push({ msg: "Categoria é obrigatória" });
  }

  if (errors.length > 0) {
    try {
      const categorias = await Categoria.findAll({ order: [["nome", "ASC"]] });
      const contexto = {
        titulo_pagina: "Cadastro de Produto",
        categorias: categorias,
        errors: errors,
        old: {
          nome: novo_produto.nome,
          preco: novo_produto.preco,
          descricao: novo_produto.descricao,
          quantidade: novo_produto.quantidade,
          status: novo_produto.status,
          categoria_id: categoria_id_numero,
        },
      };
      return res.status(400).render("produto/cria_produto", contexto);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
      return res.status(500).send("Erro interno");
    }
  }

  try {
    await Produto.create({
      nome: novo_produto.nome,
      preco: preco_numero,
      descricao: novo_produto.descricao,
      quantidade: quantidade_numero,
      status: novo_produto.status,
      categoria_id: categoria_id_numero,
      usuario_id: novo_produto.usuario_id,
    });
    return res.redirect("/");
  } catch (error) {
    console.error("Erro ao cadastrar produto:", error);
    return res.status(500).send("Erro ao cadastrar produto");
  }
};

exports.consulta = async function (req, res) {
  res.set("Cache-Control", "no-store");
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).send("Parâmetro inválido");
  }
  try {
    const produto = await Produto.findByPk(id, {
      include: [{ model: Categoria, as: "categoria" }],
    });
    if (!produto) {
      return res.status(404).send("Produto não encontrado");
    }
    const contexto = {
      titulo_pagina: "Consulta de Produto",
      produto: produto,
    };
    return res.render("produto/consulta_produto", contexto);
  } catch (error) {
    console.error("Erro ao consultar produto:", error);
    return res.status(500).send("Erro ao consultar produto");
  }
};

exports.venda = async function (req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).send("Parâmetro inválido");
  }
  try {
    const produto = await Produto.findByPk(id);
    if (!produto) {
      return res.status(404).send("Produto não encontrado");
    }
    if (produto.quantidade <= 0) {
      return res.redirect("/");
    }
    produto.quantidade = produto.quantidade - 1;
    await produto.save();
    return res.redirect("/");
  } catch (error) {
    console.error("Erro ao registrar venda:", error);
    return res.status(500).send("Erro ao registrar venda");
  }
};

exports.compra = async function (req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).send("Parâmetro inválido");
  }
  try {
    const produto = await Produto.findByPk(id);
    if (!produto) {
      return res.status(404).send("Produto não encontrado");
    }
    produto.quantidade = produto.quantidade + 1;
    await produto.save();
    return res.redirect("/");
  } catch (error) {
    console.error("Erro ao registrar compra:", error);
    return res.status(500).send("Erro ao registrar compra");
  }
};
