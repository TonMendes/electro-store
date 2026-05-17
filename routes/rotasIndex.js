var express = require("express");
var router = express.Router();
var controllerIndex = require("../controller/controllerIndex.js");

router.get("/", controllerIndex.tela_principal);
router.get("/nossa-historia", controllerIndex.nossa_historia);

module.exports = router;
