var express = require('express');
var router = express.Router();

var uid2 = require('uid2')
var SHA256 = require('crypto-js/sha256')
var encBase64 = require('crypto-js/enc-base64')

var userModel = require('../models/users')


router.post('/sign-up', async function(req,res,next){

  var error = []
  var result = false
  var saveUser = null
  var token = null

  const data = await userModel.findOne({
    email: req.body.emailFromFront
  })

  if(data != null){
    error.push('utilisateur déjà présent')
  }

  if(req.body.usernameFromFront == ''
  || req.body.emailFromFront == ''
  || req.body.passwordFromFront == ''
  ){
    error.push('champs vides')
  }


  if(error.length == 0){

    var salt = uid2(32)
    var newUser = new userModel({
      username: req.body.usernameFromFront,
      email: req.body.emailFromFront,
      password: SHA256(req.body.passwordFromFront+salt).toString(encBase64),
      token: uid2(32),
      salt: salt,
    })
  
    saveUser = await newUser.save()
  
    
    if(saveUser){
      result = true
      token = saveUser.token
    }
  }
  

  res.json({result, saveUser, error, token})
});

router.post('/sign-in', async function(req,res,next){

  var result = false
  var user = null
  var error = []
  var token = null
  
  if(req.body.emailFromFront == ''
  || req.body.passwordFromFront == ''
  ){
    error.push('champs vides')
  }

  if(error.length == 0){
    const user = await userModel.findOne({
      email: req.body.emailFromFront,
    })
  
    
    if(user){
      const passwordEncrypt = SHA256(req.body.passwordFromFront + user.salt).toString(encBase64)

      if(passwordEncrypt == user.password){
        result = true
        token = user.token
      } else {
        result = false
        error.push('mot de passe incorrect')
      }
      
    } else {
      error.push('email incorrect')
    }
  }

  res.json({result, user, error, token})
});

router.post('/add-article', async function(req, res, next) {
  
  const user = await userModel.findOne(
    {token:  req.body.tokenFromFront});
    console.log('user', user);
    console.log(req.body)
  user.likedArticles.push({
    title: req.body.articleTitleFromFront,
    desc: req.body.articleDescFromFront,
    content: req.body.articleContentFromFront,
    image: req.body.articleImgFromFront,
    link: req.body.articleLinkFromFront,
    lang: req.body.langueFromFront,
  });

  var userSaved = await user.save();

  res.json({userSaved});
});


router.get('/get-articles', async function(req, res, next) {
  let userArticles = [];

  const user = await userModel.findOne(
    {token:  req.query.tokenFromFront});

  if(user!=null){  
    userArticles = user.likedArticles;
    res.json(userArticles);
  }else{
    res.json("no articles found");
  }
 
});



router.delete('/delete-article/:id/:token', async function(req, res, next){
  const user = await userModel.findOne(
    {token: req.params.token});

    console.log("token id",req.params.token ,req.params.id )


    let array = [...user.likedArticles.filter((article) => (article._id != req.params.id))];
    user.likedArticles = array ;

    console.log("user afterFilter",user)
     
    var userSaved = await user.save();
    
  
  res.json(userSaved.likedArticles);
})

module.exports = router;
