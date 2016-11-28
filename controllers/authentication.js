const jwt = require("jwt-simple");
const config = require("../config");
const User = require("../models/user");
const validator = require('validator');

function tokenForUser(user) {
    const timestamp = new Date().getTime();
    return jwt.encode({sub: user.id, iat: timestamp}, config.secret);
}


//create token when sign in
exports.signin = function(req,res,next) {
    //from passport access to user function done
    res.send({token: tokenForUser(req.user)});
}


exports.signup = function(req,res,next){
    const email = req.body.email;
    const password = req.body.password;
    if(!email || !password) {
        return res.status(422).send({error: 'You must provide email and password'});
    }
    if(validator.isLength(password,{min: 4, max: undefined}) ===false) {
        return res.status(422).send({error: 'Your password should be at least 4'});
    }
    if(validator.isEmail(email) ===false) {
        return res.status(422).send({error: 'You did not provide valid email'});
    }
    //see if user exists
    User.findOne({email: email}, function(err,existingUser) {
        err ? next(err): '';
        
        //if yes then return error
     if(existingUser) {
         return res.status(422).send({error: 'Email already taken.'});
     }
      //if no then create an save
      const user = new User({
          email: email,
          password: password
      });
      user.save( function(err){
          if(err) {
              return next(err);
          }
          //respond to req with success
          res.json({token: tokenForUser(user)});
      });
    //   user.save().then((err, user) => {
    //       err ? next(err): '';
    //       res.json(user);
    //   })
      
    });
  
}