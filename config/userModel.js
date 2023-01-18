// npm modules
const mongoose = require('mongoose')

// Defining the UserSchema
const userSchema = mongoose.Schema({
    username: String,
    password: String
})

// Creating a User Model according to Mongoose
const UserModel = mongoose.model('User', userSchema)

module.exports = UserModel