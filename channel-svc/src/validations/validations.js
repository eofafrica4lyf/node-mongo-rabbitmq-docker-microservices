const { check } = require('express-validator');

exports.checkStringField = (name, requiredMsg) =>
    check(name).trim().notEmpty().withMessage(requiredMsg);