var express = require("express");
var router = express.Router();
const { tarefasModel } = require("../models/tarefasModel"); //usar sempre o {}
const moment = require("moment");
moment.locale('pt-br');

router.get("/", async function (req, res) {
    res.locals.moment = moment;
    //recuperar a página caso não exista definir como página 1
    let pagina = req.query.pagina == undefined ? 1 : req.query.pagina;
    // página -> offset 
    // qtde por página -> 
    // pagina 1 -> ofsset -> 0 ( pagina -1 * 5)
    // pagina 2 -> ofsset -> 5 ( pagina -1 * 5)
    // pagina 3 -> ofsset -> 10 ( pagina -1 * 5)
    const qtde = 5;
    let offset = (pagina-1) * qtde;
    let total = Math.ceil( await tarefasModel.totRegistros() / qtde);

    if(total > 1){
        //paginação 
        var paginador = {paginaAtual:pagina,totalPaginas:total};
        
    }else{
        // apenas 1 página de resultados
        var paginador = null;
    }
    
    try {
        const result = await tarefasModel.findAll(offset,qtde);
        console.log(result)
        res.render("pages/index",
             { listaTarefas: result, notificador:paginador })
    } catch (erro) {
        console.log(erro);
    }
});


router.get("/nova-tarefa", (req, res) => {
    res.locals.moment = moment;
    res.render("pages/cadastro",
        {
            tituloPagina: "Cadastro de Tarefas", tituloAba: "Cadastro",
            tarefa: {
                id_tarefa: 0, nome_tarefa: "",
                prazo_tarefa: "", situacao_tarefa: 1
            }
        });
});

router.post("/manter-tarefa", async (req, res) => {
    const objDados = {
        id : req.body.id,
        nome: req.body.nome,
        prazo: req.body.prazo,
        situacao: req.body.situacao
    }

    try {
        if(objDados.id == 0){
            const result = await tarefasModel.create(objDados);  
        }else{
            const result = await tarefasModel.update(objDados);  
        }
        
        res.redirect("/");
    } catch (erro) {
        console.log(erro);
    }
})


router.get("/editar", async (req, res) => {
    res.locals.moment = moment;
    //recuperando a querystring
    const id = req.query.id;
    try {
        const result = await tarefasModel.findById(id);
        res.render("pages/cadastro",
            {
                tituloPagina: "Alterar Tarefa", tituloAba: "Edição de Tarefa",
                tarefa: result[0]
            });
    } catch (erro) {
        console.log(erro)
    }

});


router.get("/teste-insert", async (req, res) => {

    const objDados = {
        nome: "limpar gabinete PC",
        prazo: "2026-03-23"
    }
    try {
        const result = await tarefasModel.create(objDados);
        res.send(result);
    } catch (erro) {
        console.log(erro);
    }
});

//exclusão física - hard delete
router.get("/teste-delete", async (req, res) => {



})

//exclusão lógica - soft delete
router.get("/teste-delete-logico", async (req, res) => {


})




module.exports = router;