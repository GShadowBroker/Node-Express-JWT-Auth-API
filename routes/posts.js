const router = require('express').Router()
const verifyToken = require('./verifyToken')

router.get('/', verifyToken, (req, res) => {
    res.json(req.user)
})

module.exports = router