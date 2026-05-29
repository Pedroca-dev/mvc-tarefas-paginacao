// requisição do pool de conexões
const pool = require("../../config/pool_conexoes");

const tarefasModel = {

    findAll: async (offset = null, qtde = null) => {
        try {
            if (offset == null && qtde == null) {
                var [linhas] = await pool.query(
                    "SELECT * FROM tarefas WHERE status_tarefa = 1"
                );
            } else {
                var [linhas] = await pool.query(
                    "SELECT * FROM tarefas WHERE status_tarefa = 1 LIMIT ?, ?",
                    [offset, qtde]
                );
            }
            return linhas;
        } catch (erro) {
            return erro;
        }
    },

    findById: async (id) => {
        try {
            const [linhas] = await pool.query(
                "SELECT * FROM tarefas WHERE status_tarefa = 1 AND id_tarefa = ?",
                [id]
            );
            return linhas;
        } catch (erro) {
            return erro;
        }
    },

    create: async (dados) => {
        /*
            formato json:
            { nome: "nome da tarefa", prazo: "data mysql", situacao: "cod situação" }
        */
        try {
            const [result] = await pool.query(
                "INSERT INTO tarefas (`nome_tarefa`, `prazo_tarefa`, `situacao_tarefa`) VALUES (?, ?, ?)",
                [dados.nome, dados.prazo, dados.situacao]
            );
            return result;
        } catch (erro) {
            return erro;
        }
    },

    update: async (dados) => {
        /*
            formato json:
            { id: 9, nome: "nome da tarefa", prazo: "data mysql", situacao: "cod situação" }
        */
        try {
            const [result] = await pool.query(
                "UPDATE tarefas SET `nome_tarefa` = ?, `prazo_tarefa` = ?, `situacao_tarefa` = ? WHERE id_tarefa = ?",
                [dados.nome, dados.prazo, dados.situacao, dados.id]
            );
            return result;
        } catch (erro) {
            return erro;
        }
    },

    sistuacaoTarefa: async (situacao, id) => {
        try {
            const [result] = await pool.query(
                "UPDATE tarefas SET `situacao_tarefa` = ? WHERE id_tarefa = ?",
                [situacao, id]
            );
            return result;
        } catch (erro) {
            return erro;
        }
    },

    deletarTarefa: async (id) => {
        try {
            const [result] = await pool.query(
                "UPDATE tarefas SET `status_tarefa` = 0 WHERE id_tarefa = ?",
                [id]
            );
            return result;
        } catch (erro) {
            return erro;
        }
    },

    totRegistros: async () => {
        try {
            const [result] = await pool.query(
                "SELECT COUNT(*) AS total FROM tarefas WHERE status_tarefa = 1"
            );
            return result[0].total;
        } catch (erro) {
            return erro;
        }
    }
};

module.exports = { tarefasModel };