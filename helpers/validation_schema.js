const Joi = require('@hapi/joi')

const authschema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(4).required() //regexp can also be used in password field

})

module.exports = { //using objects becoz it had many schema like Task,Products,listing etc....
    authschema,
}