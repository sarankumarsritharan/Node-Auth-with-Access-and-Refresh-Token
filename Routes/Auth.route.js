const express = require('express');
const router = express.Router()
const createError = require('http-errors')
const User = require('../models/User.model')
const { authschema } = require('../helpers/validation_schema')
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../helpers/jwt_helper')



router.post('/register', async(req, res, next) => {
    try {
        // const { email, password } = req.body
        // if (!email || !password) throw createError.BadRequest()


        const result = await authschema.validateAsync(req.body) //joi

        const Exist = await User.findOne({ email: result.email })
        if (Exist) throw createError.Conflict(`${result.email} already registered`)

        const user = new User(result) // result conatins both email and password instead of using seperately we use as result
        const savedUser = await user.save() //saving user 

        const accessToken = await signAccessToken(savedUser.id)
            //since accessToken is used as promise in signAccessToken we use await
        const refreshToken = await signRefreshToken(savedUser.id)
        res.send({ accessToken, refreshToken })
            // res.send(savedUser)

    } catch (error) {
        if (error.isJoi === true) error.status = 422 //422 is unprocessable entity from the client side
        next(error)
    }
})

router.post('/login', async(req, res, next) => {
    try {
        const result = await authschema.validateAsync(req.body)
        const user = await User.findOne({ email: result.email }) //User Uppercase
        if (!user) throw createError.NotFound('User is not registered')

        const isMatch = await user.isValidPassword(result.password)
        if (!isMatch) throw createError.Unauthorized('Username/password not Valid')

        const accessToken = await signAccessToken(user.id)
        const refreshToken = await signRefreshToken(user.id)

        res.send({ accessToken, refreshToken })

    } catch (error) {
        if (error.isJoi === true)
            return next(createError.BadRequest('Invalid username/password'))
        next(error)
    }
})


router.post('/refresh-token', async(req, res, next) => {
    try {
        const { refreshToken } = req.body
        if (!refreshToken) throw createError.BadRequest()
        const userId = await verifyRefreshToken(refreshToken)

        const accessToken = await signAccessToken(userId)
        const refToken = await signRefreshToken(userId)

        res.send({ accessToken: accessToken, refreshToken: refToken })


    } catch (error) {
        next(error)

    }
})


router.delete('/logout', async(req, res, next) => {
    res.send("logout route")
})



module.exports = router