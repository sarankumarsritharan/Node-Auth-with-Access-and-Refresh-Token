const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URI, {
        dbName: process.env.DB_NAME,
        useNewUrlParser: true, // look in console if not executed deprecated warning will occur
        useUnifiedTopology: true,
        useFindAndModify: true,
        useCreateIndex: true
    })
    .then(() => {
        console.log('mongodb connected')
    })
    .catch((error) => {
        console.log(error.message)
    })

mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to the db')
})

mongoose.connection.on('error', (err) => {
    console.log(err.message)
})

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose Connection got disconnected')
})

process.on('SIGINT', async() => {
    await mongoose.connection.close()
    process.exit(0)
})