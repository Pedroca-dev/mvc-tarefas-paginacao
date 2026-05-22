const tarefasModel = require("../models/tarefasModel");
const moment = require("moment");
const { body, validationResult } = require("express-validator");
const tarefasController = {

    regrasValidacao: [
        body("tarefa").isLength({ min: 5, max: 45}).withMessage("Nome da Tarefa deve conter de 5 a 45 letras!"),
        body("prazo").isISO8601(),
        body("situaca").isNumeric()
    ],
}