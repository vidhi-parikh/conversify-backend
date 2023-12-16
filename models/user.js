const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String
})

const User = new mongoose.model('User',userSchema)

module.exports = User