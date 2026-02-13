// import {validationResul}
const { validationResult } = require('express-validator');


function validate(req, res, next) {

    const result = validationResult(req)
    if (!result.isEmpty()) {
        return res.status(400).json({ success: false, errors: result.array() })
    }
    next()
}

module.exports = validate