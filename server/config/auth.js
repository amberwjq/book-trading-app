var passport = require('passport');
exports.authenticate = function(req,res,next){
    var auth = passport.authenticate('local', function(err, user) {
        if(err) {
            console.log("HAVE RROR");
             res.send({success:false,reason:err});}
        if((!user)||(user == "false")){ res.send({success:false})}
        console.log("why break");
          req.session.user = user; 
          console.log('req.session.user is ' + req.session.user);         
          res.send({success:true, user: user});
          
          
         
      
      })
      auth(req, res, next);


}