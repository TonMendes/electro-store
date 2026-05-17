var express = require("express");
var router = express.Router();
var controllerProdutos = require("../controller/controllerProdutos.js");
const {
  ehAutenticado,
  ehAdmin,
  ehLojista,
} = require("../middlewares/controleUsuario.js");

router.get("/cria", ehAutenticado, ehAdmin, controllerProdutos.cria_get);
router.post("/cria", ehAutenticado, ehAdmin, controllerProdutos.cria_post);
router.get("/consulta/:id", controllerProdutos.consulta);
router.post("/venda/:id", ehAutenticado, ehLojista, controllerProdutos.venda);
router.post("/compra/:id", ehAutenticado, ehLojista, controllerProdutos.compra);

module.exports = router;
