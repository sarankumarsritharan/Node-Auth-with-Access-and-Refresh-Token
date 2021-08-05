const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
})

UserSchema.pre('save', async function(next) {
    //inorder to use this keyword arr fun changed to normal fun   middleware is fired before saving new user pre and save is middleware provided by mongodb
    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(this.password, salt)
        this.password = hashedPassword
        next()

    } catch (error) {
        next(error)
    }
})

//check password from user with db password
UserSchema.methods.isValidPassword = async function(password) {
    try {
        return await bcrypt.compare(password, this.password)
    } catch (error) {
        throw error
    }
}


const User = mongoose.model('user', UserSchema) // user is the collection under the dbNAME--> 

module.exports = User