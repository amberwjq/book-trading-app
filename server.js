var express = require('express'),
    passport = require('passport'),
    localStrategy = require('passport-local').Strategy,
    mongoose =require('mongoose')



//an environment variable that I can determine I'm in dev mode or production mode
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var app = express();
var config = require('./server/config/config')[env]

require('./server/config/express')(app,config);

require('./server/config/mongoose')(config);

var User = mongoose.model("User");//grab User model
passport.use(new localStrategy(
    function(username,password,done){
        User.findOne( {username:username}).exec(function(error,user){
            if(user && user.authenticate(password)){
                return done(null,user)
            }
            else{
                return done(null,false);
            }          
        })

    }
));
passport.serializeUser(function(user, done) {
    if(user) {
      done(null, user._id);
    }
  });

  passport.deserializeUser(function(id, done) {
    User.findOne({_id:id}).exec(function(err, user) {
      if(user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    })
  })
require('./server/config/route')(app);


var port=
app.listen(config.port);
console.log('Listen on port    ' + config.port +'.....');