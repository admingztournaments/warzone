const router = require("express").Router()

const isAuthorized = (req, res, next) => {
       if(req.user){
              console.log("user IS logged In.");
              console.log(req.user);
              next();
       }
       else{
              console.log("user is not logged in.");
              res.redirect('/login')
       }
}


router.get("/", isAuthorized, (req, res) => {
       res.send(200)
})


module.exports = router;