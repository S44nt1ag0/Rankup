const express = require('express')
const router = express.Router()
const controller = require("./controller")

router.get("/", controller.home);
router.get("/signup", controller.cadastrar);
router.get("/sign", controller.logar);
router.get("/dash", verificaSessao, controller.logado);
router.get("/create", verificaSessao, controller.criar_grupo);
router.get("/team", verificaSessao, controller.me_teams);
router.get("/api/sair", verificaSessao, controller.api_sair);
router.get("/grupos/:id", verificaSessao, controller.grupos_get);
router.get("/payment", controller.pagamento);
router.get("/order", controller.order);
router.get("/enemy", verificaSessao, controller.enemy);
router.get("/api/gerar/pix", verificaLogin, controller.gerar_pix);
router.get("/api/consulta/pix/:id", verificaLogin, controller.consulta_pix);
router.post("/api/participante", verificaSessao, controller.add_participante);
router.post("/api/logar", controller.api_logar);
router.post("/api/cadastrar", controller.api_cadastrar);
router.post("/api/create", verificaSessao, controller.cadastrar_grupo);
router.get("/painel", controller.painel);
router.post("/login/admin", controller.login_painel);
router.get("/admin", verificaAdmin, controller.admin);
router.get("/chaves", verificaAdmin, controller.chaves);
router.get("/usuarios", verificaAdmin, controller.usuarios);
router.get("*", controller.error);

function verificaAdmin(req, res, next) {
    if (req.session && req.session.admin) {
            next();
    } else {
        res.redirect("/");
    }
};

function verificaLogin(req, res, next) {
    if (req.session && req.session.usuario) {
            next();
    } else {
        res.redirect("/sign");
    }
};

function verificaSessao(req, res, next) {
    if (req.session && req.session.usuario) {

        if(req.session.usuario.membership == false){
            res.redirect("/payment");
        } else {
            next();
        }

    } else {
        res.redirect("/");
    }
};

module.exports = router;