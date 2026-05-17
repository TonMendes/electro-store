var express = require("express");
var router = express.Router();
var controllerUsuarios = require("../controller/controllerUsuarios.js");
const { ehAutenticado } = require("../middlewares/controleUsuario.js");

router.get("/login", controllerUsuarios.login_get);
router.post("/login", controllerUsuarios.login_post);
router.get("/logout", ehAutenticado, controllerUsuarios.logout);
router.get("/cria", controllerUsuarios.cria_get);
router.post("/cria", controllerUsuarios.cria_post);

module.exports = router;
