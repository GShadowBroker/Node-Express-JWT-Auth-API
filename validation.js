'use strict'

const Joi = require('@hapi/joi')

const registerValidation = (data) => {
    
    const schema = Joi.object({
        name: Joi.string().min(6).max(55).alphanum().required(),
        email: Joi.string().min(6).max(255).email().required(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,30}$')).required(),
        repeat_password: Joi.ref('password')
    }).with('password', 'repeat_password')

    return schema.validate(data)
}

const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().min(6).max(255).email().required(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,30}$')).required()
    })

    return schema.validate(data)
}


module.exports = {
    registerValidation,
    loginValidation
}