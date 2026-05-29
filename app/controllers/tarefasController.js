const { tarefasModel } = require("../models/tarefasModel");
const moment = require("moment");
const { body, validationResult } = require("express-validator");

moment.locale("pt-br");

const tarefasController = {

    regrasValidacao: [
        body("tarefa")
            .isLength({ min: 5, max: 45 })
            .withMessage("Nome da Tarefa deve conter de 5 a 45 letras!"),
        body("prazo")
            .isISO8601()
            .withMessage("Prazo inválido!"),
        body("situacao")
            .isNumeric()
            .withMessage("Situação inválida!")
    ],

    listarTarefasPaginadas: async (req, res) => {
        res.locals.moment = moment;

        let pagina = req.query.pagina == undefined ? 1 : parseInt(req.query.pagina);
        const qtde = 5;
        let offset = (pagina - 1) * qtde;
        let total = Math.ceil(await tarefasModel.totRegistros() / qtde);

        let paginador = total > 1 ? { paginaAtual: pagina, totalPaginas: total } : null;

        try {
            const result = await tarefasModel.findAll(offset, qtde);
            res.render("pages/index", { listaTarefas: result, notificador: paginador });
        } catch (erro) {
            console.log(erro);
            res.status(500).send("Erro ao listar tarefas.");
        }
    },

    exibirFormCadastro: (req, res) => {
        res.locals.moment = moment;
        res.render("pages/cadastro", {
            tituloPagina: "Cadastro de Tarefas",
            tituloAba: "Cadastro",
            tarefa: {
                id_tarefa: 0,
                nome_tarefa: "",
                prazo_tarefa: "",
                situacao_tarefa: 1
            },
            erros: []
        });
    },

    exibirTarefaId: async (req, res) => {
        res.locals.moment = moment;
        const id = req.query.id;
        try {
            const result = await tarefasModel.findById(id);
            res.render("pages/cadastro", {
                tituloPagina: "Alterar Tarefa",
                tituloAba: "Edição de Tarefa",
                tarefa: result[0],
                erros: []
            });
        } catch (erro) {
            console.log(erro);
            res.status(500).send("Erro ao buscar tarefa.");
        }
    },

    manterTarefa: async (req, res) => {
        const erros = validationResult(req);
        if (!erros.isEmpty()) {
            res.locals.moment = moment;
            const idAtual = req.body.id;
            let tarefaAtual;
            if (idAtual != 0) {
                const result = await tarefasModel.findById(idAtual);
                tarefaAtual = result[0];
            } else {
                tarefaAtual = {
                    id_tarefa: 0,
                    nome_tarefa: req.body.nome,
                    prazo_tarefa: req.body.prazo,
                    situacao_tarefa: req.body.situacao
                };
            }
            return res.render("pages/cadastro", {
                tituloPagina: idAtual != 0 ? "Alterar Tarefa" : "Cadastro de Tarefas",
                tituloAba: idAtual != 0 ? "Edição de Tarefa" : "Cadastro",
                tarefa: tarefaAtual,
                erros: erros.array()
            });
        }

        const objDados = {
            id: req.body.id,
            nome: req.body.nome,
            prazo: req.body.prazo,
            situacao: req.body.situacao
        };

        try {
            if (objDados.id == 0) {
                await tarefasModel.create(objDados);
            } else {
                await tarefasModel.update(objDados);
            }
            res.redirect("/");
        } catch (erro) {
            console.log(erro);
            res.status(500).send("Erro ao salvar tarefa.");
        }
    },

    iniciarTarefa: async (req, res) => {
        const { id } = req.query;
        try {
            await tarefasModel.sistuacaoTarefa(2, id);
        } catch (e) {
            console.log(e);
            return res.json({ erro: "Falha ao acessar dados" });
        }
        let url = req.rawHeaders[25] || "";
        let urlChamadora = url.replace("http://localhost:3000", "");
        res.redirect(urlChamadora || "/");
    },

    excluirTarefa: async (req, res) => {
        const { id } = req.query;
        try {
            await tarefasModel.deletarTarefa(id);
            res.redirect("/");
        } catch (e) {
            console.log(e);
            res.status(500).send("Erro ao excluir tarefa.");
        }
    }
};

module.exports = tarefasController;