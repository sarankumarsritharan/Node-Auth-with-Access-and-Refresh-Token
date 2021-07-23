const express = require('express');
const morgan = require('morgan')
const creteError = require('http-errors')
require('dotenv').config()
const Authroute = require('./Routes/Auth.route')


const app = express()


const PORT = process.env.PORT || 3000


app.get('/', async(req, res, next) => {
    res.send('Hello world from express server')
})

app.use('/auth', Authroute)

app.use(async(req, res, next) => {
    next(creteError.NotFound())
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.send({
        error: {
            status: error.status || 500,
            message: error.message
        },
    })
});

app.listen(PORT, (req, res) => {
    console.log(`listening on port ${PORT}....`)
})