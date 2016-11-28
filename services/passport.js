const passport = require("passport");
const User = require("../models/user");
const config = require("../config");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const LocalStrategy = require("passport-local");


// ========================
 //  LOCAL STRATEGY
// ========================
const localOptions = {usernameField: 'email'};
const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
    User.findOne({email: email}, function(err, user) {
        if(err) {
            return done(err);
        }
        if(!user) {
            return done(null, false); 
        }
        //compare passwords
        user.comparePassword(password, function(err, isMatch){
            if(err) {return done(err);}
            if(!isMatch) { return done(null, false);}
            
            return done(null,user);
        });
    });
});


// ========================
 //  JWT STRATEGY
// ========================

//setup options for JWT Strategy
const jwtOptions= {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.secret
};

//create JWT strategy
//payload - decoded token(user.id, timestamp)
//done - callback 
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done){
    
    //see if user.id in payload exists in database 
    //if yes, done with user
    //if no , done withoud user object
    User.findById(payload.sub, function(err, user) {
        if(err) {
            return done(err, false);
        }
        if(user) {
            done(null,user);
        }else {
            done(null,false);
        }
    });
    
});

//tell passport to use strategy

passport.use(jwtLogin);
passport.use(localLogin);