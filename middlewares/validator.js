const { check, validationResult } = require("express-validator")

module.exports = {
  validateRegister : [
    check("name").notEmpty(),
    check("status").notEmpty(),
    check("address").notEmpty(),
    (req, res, next) => {
      const error = validationResult(req);
      if(!error.isEmpty()){
        return res.status(422).send({error: error.array()})
      }
      next();
    }
  ],
  updateUser : [
    check("idUser").notEmpty(),
    (req, res, next) => {
      const error = validationResult(req);
      if(!error.isEmpty()){
        return res.status(422).send({error: error.array()})
      }
      next();
    }
  ],
}