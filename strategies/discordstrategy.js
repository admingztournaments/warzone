const DiscordStrategy = require('passport-discord').Strategy;
const DiscordUser = require('../models/DiscordUser')

const passport = require("passport")

// const CLIENT_ID="798082008470257694"
// const CLIENT_SECRET="zSO5qYv71FqogzgguntgetiojFZe0gO6"
// const CLIENT_REDIRECT="http://localhost:5000/api/v1/redirect"

passport.serializeUser((user, done) => {
       done(null, user.id)
})

passport.deserializeUser(async (id, done)=> {
       const user = await DiscordUser.findById(id);
       if(user){
              done(null, user)
       }
})


passport.use(new DiscordStrategy({
       clientID:"798082008470257694",
       clientSecret:"zSO5qYv71FqogzgguntgetiojFZe0gO6",
       callbackURL:"http://localhost:5000/api/v1/redirect",
       scope:['identify', 'email', "connections"]
}, async (accessToken, refreshToken, profile, done) => {
       // console.log(profile.username);
       // console.log(profile.id);
       // console.log(profile.email);
  
       try {
              console.log(accessToken)
              const user = await DiscordUser.findOne({discordId: profile.id})
              if(user){
                     done(null, user)
              }else{
                     const newUser = await DiscordUser.create({
                            discordId: profile.id,
                            username: profile.username,
                            email:profile.email,
                            game_id:false,
                            game_console:false
                     });
                     const savedUser = await newUser.save();
                     done(null, savedUser)
              }
       } catch (error) {
              console.log(err);
              done(err, null)
       }
}))

