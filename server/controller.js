var crypto = require('crypto');
const axios = require('axios');
const fs = require('fs');
const sequelize = require("./db/db");
const { QueryTypes } = require('sequelize');
const Usuarios = require("./db/models/usuarios.model")
const Grupos = require("./db/models/grupos.model")
const Participantes = require("./db/models/participantes.model")
const Pix = require("./db/models/pix.model")
const Pagamentos = require("./db/models/pagamentos.model")
const Admins = require("./db/models/admins.model")
const Dados = require("./db/models/dados.model")
const utils = require("./utils")

async function home(req, res) {
    res.render("./home", {"dados": req.session.usuario, "valor": process.env.valor})
}

async function cadastrar(req, res) {
    res.render("./signup")
}

async function logar(req, res) {
    res.render("./sign")
}

async function logado(req, res) {
    res.render("./dash", {"dados": req.session.usuario})
}

async function criar_grupo(req, res) {
    res.render("./create")
}

async function cadastrar_grupo(req, res){

    if(!req.body.nome){
        res.send({error:true, msg:"Falta de Parametros"});
        return;
    }

    let id_user = req.session.usuario.id;

    const verificar_grupos = await Grupos.findOne({
        where: {
            admin_id: id_user
        }
    });

    if (verificar_grupos){
        res.send({error:true, msg:"voce já tem um grupo criado!"})
    } else {

        const criar_user = await Grupos.create({
            nome: req.body.nome,
            nivel: 1,
            admin_id: id_user
        })
    
        if(criar_user){
    
            webhook_grupo(req.body.nome)
            res.send({error:false, msg:"grupo Criado com Sucesso!"})
    
        } else {
            res.send({error:true, msg:"nao foi possivel criar grupo"})
        }

    }

}

async function api_logar(req, res) {

    if(!req.body.usuario || !req.body.senha) {
        res.send({error:true, msg:"Falta de Parametros"});
        return;
    }

    let user = req.body.usuario;
    var hash = crypto.createHash('md5').update(req.body.senha).digest('hex');

    const verificar_login = await Usuarios.findOne({
        where: {
          nome: user,
          senha: hash
        }
    });

    if (verificar_login){
        
        let dados = verificar_login.dataValues;

        let user = dados.nome;
        let id = dados.id;
        let membership = dados.membership;
        let email = dados.email;

        let dados_cookie = {
            id: id,
            nome: user,
            email: email,
            membership: membership,
        }

        req.session.usuario = dados_cookie;
        res.send({error:false, msg:"logado com sucesso"})

    } else {
        res.send({error:true, msg:"usuario ou senha incorretos!"})
    }

}

async function api_cadastrar(req, res){

    if(!req.body.usuario || !req.body.senha || !req.body.email) {
        res.send({error:true, msg:"Falta de Parametros"});
        return;
    }

    let user = req.body.usuario;
    var hash = crypto.createHash('md5').update(req.body.senha).digest('hex');
    let email = req.body.email;

    const verificar_usuario = await Usuarios.findOne({
        where: {
          nome: user
        }
    });

    if (verificar_usuario) {
        res.send({error:true, msg:"usuario já existente"})
    } else {

        const criar_user = await Usuarios.create({
            nome: req.body.usuario,
            senha: hash,
            email: email
        })

        webhook_cadastro(req.body.usuario)
        incrementar_user()

        res.send({"error":null, msg: "usuario criado com sucesso!"})
    }

}

async function api_sair(req, res) {

    if(req.session && req.session.usuario){

        console.log(req.session.usuario)
        req.session = null;
        res.send({error:false, msg:"deslogado"})
        
    } else {
        res.redirect("/")
    }

}

async function me_teams(req, res){

    let id_user = req.session.usuario.id;

    const gps = await Grupos.findAll({
        where: { admin_id: id_user },
        include: [{
          model: Participantes,
          as: 'participantes'
        }],
        nest: true,
    })
    
    if (gps) {
        res.render("./grupos", {"grupos": gps[0]});
    } else {
        res.render("./grupos", {"mensagem": "Nenhum grupo encontrado"});
    }

}

async function grupos_get(req,res) {

    const id = req.params.id;
    const dados = req.session.usuario;

    if(!id || !dados) {
        res.send({"error": true, msg:"erro ao consultar grupo"})
    } else {
        
    }

}

async function pagamento(req,res,) {

    if(!req.session || !req.session.usuario){
        res.redirect('/');
    } else {
        res.render("./payment", {"dados": req.session.usuario, "valor": process.env.valor})
    }

}

async function enemy(req,res){

    let usuarioId = req.session.usuario.id;

    const gps = await Grupos.findAll({
        where: {
          admin_id: usuarioId
        },
        include: [{
            model: Participantes,
            as: 'participantes'
        }],
        nest: true,
    });

    const ids_Grupos = gps.map(grupo => grupo.id_rival);

        const rival = await Grupos.findAll({
            where: {
              id: ids_Grupos
            },
            include: [{
                model: Participantes,
                as: 'participantes'
            }],
            nest: true,
        });

        let data = {grupo:gps, rival: rival};
        res.render("./enemy", {data: data})

}

function generateCode() {
    const prefix = "PAY-ANARQ-";
    const randomNumbers = Math.floor(Math.random() * 1e10).toString().padStart(10, '0');
    return prefix + randomNumbers;
}

async function gerar_pix(req,res){

    let email = req.session.usuario.email;
    let id_user = req.session.usuario.id;

    axios.post('https://api.mercadopago.com/v1/payments', `{"transaction_amount": ${process.env.valor},"description": "Ingresso Anarquia","payment_method_id": "pix","payer": {"email": "${email}"}}`, {
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json',
          'Authorization': process.env.Authorization_ML,
          'X-Idempotency-Key': generateCode()
        }
    }).then(response => {

        let data = response.data;

        if(!data){
            res.send({error:true, msg:"Erro ao gerar Pix"})
            return;
        }

        let id = data.id;
        let qr_code64 = data.point_of_interaction.transaction_data.qr_code_base64;
        let qr_copia = data.point_of_interaction.transaction_data.qr_code;

        let dados = {
            id: id,
            qr_code_image: qr_code64,
            qr_code: qr_copia
        };

        Pix.create({pix_id:id, user_id:id_user}).then(newUser => {
            res.send({error:false, data:dados})
        }).catch(error => {
            res.send({error:true, msg:"erro ao gerar pix"})
        });

    }).catch(error => {
        console.log(error)
        res.send({error:true, msg:"nao foi possivel gerar o pix!"})
    });

}

function webhook_grupo(nome){

    axios.post(process.env.WebHook, `{"embeds":[{"title":"Nova Equipe","color":7419530,"fields":[{"name":"${nome}","value":"Nova equipe Cadastrada!"}]}]}`, {
        headers: {
          'Content-Type': 'application/json' 
        }
    }).then(response => {
        console.log("WebHook Enviado com sucesso!")
    }).catch(error => {
        console.log("Erro ao enviar WebHook")
    })

}

function webhook_cadastro(nome){

    axios.post(process.env.WebHook, `{"embeds":[{"title":"Novo Cadastro","color":1752220,"fields":[{"name":"${nome}","value":"Cadastrou-se no site!"}]}]}`, {
        headers: {
          'Content-Type': 'application/json' 
        }
    }).then(response => {
        console.log("WebHook Enviado com sucesso!")
    }).catch(error => {
        console.log("Erro ao enviar WebHook")
    })

}

function webhook(id_pagamento){

    axios.post(process.env.WebHook, `{"embeds":[{"title":"Pagamento Efetuado","color":5763719,"fields":[{"name":"${id_pagamento}","value":"Participante pagou ${process.env.valor}$💸"}]}]}`, {
        headers: {
          'Content-Type': 'application/json' 
        }
    }).then(response => {

        console.log("WebHook Enviado com sucesso!")
        utils.webhook_pago();

    }).catch(error => {
        console.log("Erro ao enviar WebHook")
    })

}

function gerarRecibo(id_transacao, id_pagamento) {

    const data = new Date().toLocaleDateString();
    const recibo = `Recibo Anarquia \n\nID Transação: ${id_transacao} \nID Pagamento: ${id_pagamento} \nValor: ${process.env.valor}$ \nData: ${data}`;

    fs.writeFile(`./public/recibos/${id_pagamento}.txt`, recibo, (err) => {
        if (err) throw err;
        console.log('Recibo salvo com sucesso!');
    });
}

async function consulta_pix(req,res){

    const id_pix = req.params.id;
    const id_user = req.session.usuario.id;

    if(!id_pix || !id_user){
        res.send({error:true, msg:"falta parametros"})
        return;
    }

    Pix.findOne({ where: { pix_id: id_pix } }).then(data => {

        if(!data){
            res.send({error:true, msg:"Esse id não pertence a voce!"})
            return;
        }

        let user = data.user_id;

        if(user == id_user){
            
            axios.get(`https://api.mercadopago.com/v1/payments/${id_pix}`, {
                headers: {
                    'Authorization': process.env.Authorization_ML,
                    'Content-Type': 'application/json'
                }
            }).then(response => {

                let data = response.data;

                if(!data){
                    res.send({error:true, msg:"erro ao consultar pix"})
                    return;
                }

                let status = data.status;

                if(status == "approved"){

                    let dados = {
                        id_transacao: data.transaction_details.transaction_id,
                        id_pagamento: id_pix
                    }

                    gerarRecibo(dados.id_transacao, dados.id_pagamento)
                    webhook(dados.id_pagamento);
                    incrementar_pix()

                    Pagamentos.create({transaction_id:dados.id_transacao, id_pagamento:dados.id_pagamento, id_usuario: id_user});
                    Usuarios.update({ membership: 1 }, { where: { id: id_user } });
                    
                    req.session.usuario.membership = 1;

                    res.send({error:false, msg:"pix pago com sucesso!", dados: dados});

                } else {
                    res.send({error:true, msg:"pix nao pago!", status: status});
                }

            }).catch(error => {
                res.send({error:true, msg:"erro ao consultar pix"})
            });

        } else {
            res.send({error:true, msg:"esse id_pix nao se refere ao seu usuario"})
        }

    }).catch(error => {
        res.send({error:true, msg:"erro ao gerar pix"})
    });

}

async function order(req,res){
    let id = req.session.usuario.id;
    const buscar_pagamento = await Pagamentos.findAll({where: {id_usuario: id}, nest:true});
    res.render("./order", {dados: buscar_pagamento[0], "valor": process.env.valor})
}

async function add_participante(req, res){

    let participante = req.body.nome;
    let id = req.session.usuario.id;

    const puxar_gp = await Grupos.findAll({where: {admin_id: id}});

    if(puxar_gp){

        let gp_id = puxar_gp[0].id
        const add = await Participantes.create({nome:participante, grupo_id:gp_id});

        if(add){

            res.send({error:false, msg:"Participante Cadastrado!"})

        } else {
            res.send({error:true, msg:"erro ao adicionar participante!"})
        }


    } else {

        res.send({error:true, msg:"erro consultar seu grupo!"})

    }

}

async function error(req,res) {
    res.render("./erro")
}

async function painel(req,res) {
    res.render("./painel")
}

function incrementar_user(){
   return Dados.increment('cadastrados', { by: 1, where: {id: 1}});
}

function incrementar_pix(){
    return Dados.increment('pix', { by: process.env.valor, where: {id: 1}});
}

async function login_painel(req, res){

    let usuario = req.body.usuario;
    let senha = req.body.senha;

    if(!usuario || !senha){
        res.send({error:true, msg:"falta parametros"})
        return;
    }

    var hash = crypto.createHash('md5').update(senha).digest('hex');

    const verificar_login = await Admins.findOne({
        where: {
          usuario: usuario,
          senha: hash
        }
    });

    if(verificar_login){

        let dados = verificar_login.dataValues;
        let user = dados.usuario;
        let id = dados.id;

        let dados_cookie = {
            user: user,
            id: id
        }

        req.session.admin = dados_cookie;
        res.send({error:false, msg:"logado com sucesso"})

    } else {
        res.send({error:true, msg:"Usuario ou Senha incorreta!"})
    }

}

async function admin(req, res){

    const find_dados = await Dados.findAll();
    res.render("./admin", {"dados": req.session.admin, "info": find_dados})
}

async function chaves(req, res){
    const find_dados = await Dados.findAll();
    res.render("./chaves", {"dados": req.session.admin, "info": find_dados})
}

async function usuarios(req, res){
    const find_users = await Usuarios.findAll({attributes: { exclude: ['senha', 'createdAt', 'updatedAt'] }, order: [['createdAt', 'DESC']],raw: true});
    res.render("./usuarios", {"dados": req.session.admin, "usuarios": find_users})
}

module.exports = {
    home,
    cadastrar,
    logar,
    logado,
    criar_grupo,
    api_logar,
    api_cadastrar,
    api_sair,
    grupos_get,
    pagamento,
    me_teams,
    cadastrar_grupo,
    gerar_pix,
    consulta_pix,
    enemy,
    add_participante,
    error,
    painel,
    chaves,
    login_painel,
    admin,
    usuarios,
    order
}