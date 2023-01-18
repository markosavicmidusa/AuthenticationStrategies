const mongoose = require('mongoose')

const userOAuthSchema = mongoose.Schema({
    googleId: String,
    username: String
})

const userModelOAuth = mongoose.model('UserOAuth', userOAuthSchema)

module.exports = userModelOAuth