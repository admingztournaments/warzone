const express = require('express');
const router = express.Router();
// const controllers = require('./../controllers/controllers');
const passport = require("passport")

const frontEnd = process.env.FRONTEND || 'http://localhost:3000';

const DiscordUser = require('../models/DiscordUser')



const isAuthorized = (req, res, next) => {
       if(req.user){
              console.log("user IS logged In.");
              console.log(req.user);
              next();
       }
       else{
              console.log("user is not logged in.");
              res.redirect(frontEnd)
       }
}


router.get("/register", (req, res)=>{
       if(req.user){
              const data = {
                     "username":req.user.username
                     
              }
              res.render('register.ejs', context=data)
       }else{
              const data = {
                     "username":""
              }
              res.render('register.ejs', context=data)
       }

       // if(req.session){
       //        res.json({
       //               "user":req.user
       //        })
       // }else{
       //        res.json({
       //               "user":null
       //        })
       // }
 
})

router.get('/auth', passport.authenticate("discord"));

router.get('/redirect', passport.authenticate("discord", {
       // failureRedirect:"/login",
       // successRedirect:"http://localhost:3000/"
}), (req, res)=>{
       res.redirect(frontEnd)
})

router.post('/users_game_info', isAuthorized, (req, res) => {
       console.log(req.body);

       const user = req.user

       DiscordUser.updateOne({username: user.username}, {
              game_id:req.body.game_id,
              game_console:req.body.console
       }).then((res)=>{
              // console.log(res);
              user.save()
       }).catch((err)=>{
              console.log(err);
       })


       res.redirect(frontEnd)
})

router.get('/user', (req, res)=>{
       if(req.user){
              res.json(req.user)       
       }else{
              res.json({
                     msg:"Pls Login First"
              })
       }
})


router.get('/logout', (req, res) => {
       req.logout()

       res.redirect('http://localhost:3000/')
})



module.exports = router;