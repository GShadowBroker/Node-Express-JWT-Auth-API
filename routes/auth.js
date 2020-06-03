'use strict'

const router = require('express').Router()
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const { registerValidation, loginValidation } = require('../validation')
const bcrypt = require('bcryptjs')

class ErrorObject {
    constructor(msg, path) {
        this.msg = msg
        this.path = path
    }
}

router.post('/register', async (req, res) => {

    // Validate the data before creating a user
    const { error } = registerValidation(req.body)

    if (error) return res.status(400).send(
        new ErrorObject(
            error.details[0].message,
            error.details[0].context.key
        )
    )

    const emailExists = await User.findOne({ email: req.body.email })

    if (emailExists) return res.status(400).send(new ErrorObject('This email already exists', 'email'))

    //Hash the password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    // Create user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    })
    try {
        const savedUser = await user.save()
        return res.status(201).send({ user: user._id })
    } catch(err) {
        return res.status(400).send(err)
    }
})

router.post('/login', async (req, res) => {

    // Validate the data before logging in
    const { error } = loginValidation(req.body)
    if (error) return res.status(400).send(
            new ErrorObject(
                error.details[0].message,
                error.details[0].context.key
            )
        )

    // Check if email exists
    const user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(400).send(new ErrorObject('This email does not exist', 'email'))

    // Check if password is correct
    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) return res.status(400).send(new ErrorObject('The password is incorrect', 'password'))

    // Create and assign a token
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET)
    res.header('auth-token', token).send(token)
})

module.exports = router