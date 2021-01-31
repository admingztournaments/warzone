const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
       discordId: {type: String, required:true},
       username: {type:String, required:true},
       email: {type:String, required:true},
       game_id:{type:String, required:false},
       game_console:{type:String, required:false}
})

const User = module.exports = mongoose.model("User", UserSchema)