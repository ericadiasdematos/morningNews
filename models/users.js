const mongoose = require('mongoose')

const likedArticlesSchema = mongoose.Schema({
    title: String,
    desc: String,
    content: String,
    image: String,
    link: String,
})

const userSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    token: String,
    salt: String, 
    likedArticles: likedArticlesSchema,

})

const userModel = mongoose.model('users', userSchema)

module.exports = userModel