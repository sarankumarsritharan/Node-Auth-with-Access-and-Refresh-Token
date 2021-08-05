const express = require('express');
const morgon = require('morgan') // to display output in console
const creteError = require('http-errors')
require('dotenv').config()
require('./helpers/init_mongodb')
const Authroute = require('./Routes/Auth.route')
const { verifyAccessToken } = require('./helpers/jwt_helper')


const app = express()

app.use(morgon('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


const PORT = process.env.PORT || 3000


app.get('/', verifyAccessToken, async(req, res) => {
    console.log(req.headers['authorization'])
    res.send('Hello world from express server')
})

app.use('/auth', Authroute)

// Handling Error
app.use(async(req, res, next) => {
    next(createError.NotFound())
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.send({
        error: {
            status: error.status || 500,
            message: error.message
        },
    })
})

app.listen(PORT, (req, res) => {
    console.log(`Listening on port ${PORT}....`)
})