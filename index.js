'use strict'

if (process.env.NODE_ENV !== 'production') require('dotenv').config()
const express = require('express')
const host = '127.0.0.1'
const port = process.env.PORT || 8000
const mongoose = require('mongoose')
const cors = require('cors')
const app = express()
app.set('port', process.env.PORT || 8000)
app.disable("x-powered-by")

// Import routes
const authRouter = require('./routes/auth')
const postsRouter = require('./routes/posts')

// Connect to DB
mongoose.connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => console.log('Connected to the database'))

// Middlewares
app.use(express.json()) //body parser
app.use(cors())

// Route middlewares
app.use('/api/user', authRouter)
app.use('/api/posts', postsRouter)

app.listen(app.get('port'), () => console.log(`Listening to ${host}:${port}`))