var mongoose =require('mongoose');
var User = require('../models/user');


module.exports=function(config){

mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
        // we're connected!
        console.log("Connected correctly to server"+config.db);
      });
 
      // User.createDefaultUsers();     


}