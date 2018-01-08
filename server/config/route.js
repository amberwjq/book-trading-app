var express = require('express');
var app = express();
var path = process.cwd();
var auth=require('./auth')
var encrypt = require('../encryption');
var crypto = require('crypto');
var User = require('../models/user');
var Book = require('../models/book');
var Transaction = require('../models/transaction');
var server = require('http').Server(app);
var request = require("request-promise");
module.exports=function(app,passport){
    function isLoggedIn (req, res, next) {
        console.log("IN LOGGEDIN USER____"+req.session.user);
        console.log("session ID_____"+req.session.id);
		if (req.session.user) {
			return next();
		} else {
            console.log("NOT LOGGED IN");
            res.sendFile(path+'/public/views/main.html');
		}
	}

app.route('/partials/*')
.get(function(req, res) {
    console.log("I AM IN   "+req.params[0])
    res.sendFile(path+'/public/views/' + req.params[0]);
    });

// app.route('/')
// .get(isLoggedIn, function (req, res) {
  
//     res.redirect('/partials/book.html');
// });    

app.route('/login')
    // .get(function (req, res) {
    //     res.sendFile(path + '/public/views/login.html');
    // })
    .post(auth.authenticate);

app.route('/logout')
    .post(function (req, res) {
        req.session.user=null;
        req.logout();
       res.end();
    });
app.route('/api/signup')
    .post(function(req, res) { 
        var userData = req.body;
        userData.username = userData.username.toLowerCase();
        userData.salt = encrypt.createSalt();
        userData.hashed_pwd = encrypt.hashPwd(userData.salt, userData.password);
        User.create(userData, function(err, user) {
          if(err) {
            console.log("err"+err)
            console.log("index    "+ err.toString().indexOf('E11000'));
            if(err.toString().indexOf('E11000') > -1) {
              err = new Error('Duplicate Username');
            }
            console.log("after rror____"+ err);
            return res.send({reason:err.toString()});
          }
          req.session.user = user; 
          console.log('req.session.user is ' + req.session.user);  
          return res.send({success:true, user: user});
            
          })

     
    });
app.get('/api/books', function (req, res, next) {
    console.log('in routes get api/books');
    if(req.session.user)
    {
        Book.find({'_creator': { $ne: req.session.user._id},'status':0})
    
        .exec(function(err, books){
            if(err){
                res.send(err);
            }          
            return res.send({success:true, books: books});
            });       
    }
    else{
        Book.find({'status':0})
    
        .exec(function(err, books){
            if(err){
                res.send(err);
            }          
            return res.send({success:true, books: books});
            });
    }
    
    });
app.route('/api/mybook/*')
.get(isLoggedIn, function (req, res, next) {
    var user = req.params[0];

    if(req.session.user.username != user)
    {
        return res.send({success:false, reason: "unauthorized user"}); 
    }    
    User.findOne({ username : user}).exec(function(err, doc){
        Book
            .find({ '_creator': doc._id})
            .exec(function(err, books){
                if(err){
                    res.send(err);
                }
                return res.send({success:true, books: books});
                });
    });
    
    });
    app.route('/api/mycart/*')
    .get(isLoggedIn, function (req, res, next) {
        var user = req.params[0];
        if(req.session.user.username != user)
        {
            return res.send({success:false, reason: "unauthorized user"}); 
        }    
       
            Book
                .find({ 'buyer': user,'status':3})
                .exec(function(err, books){
                    if(err){
                        res.send(err);
                    }
                    return res.send({success:true, books: books});
                    });
      
        
        });
    app.route('/api/mytransaction/*')
    .get(isLoggedIn, function (req, res, next) {
        var user = req.params[0];
       
        if(req.session.user.username != user)
        {
            return res.send({success:false, reason: "unauthorized user"}); 
        }    
        
            Transaction
                .find({ 'buyer': user})
                .exec(function(err, transactions){
                    if(err){
                        res.send(err);
                    }
                   
                    return res.send({success:true, transactions: transactions});
                    });
        
        
        });        

        app.route('/api/requestreceived/*')
        .get(isLoggedIn, function (req, res, next) {
            var user = req.params[0];
            console.log('in routes requestreceived user to find  '+ user);
            console.log("session user "+ req.session.user.username);
            if(req.session.user.username != user)
            {
                return res.send({success:false, reason: "unauthorized user"}); 
            }    
            User.findOne({ username : user}).exec(function(err, doc){
                Book
                    .find({ '_creator': doc._id,'status':3})
                    .exec(function(err, books){
                        if(err){
                            res.send(err);
                        }
                        return res.send({success:true, books: books});
                        });
            });
            
            });  
                             
      
app.get('/api/book/:id', function (req, res, next) {
    console.log("IN API BOOK ID");
   
    var bookName =req.params.id;
   
    var options = { method: 'GET',
    url: 'https://www.googleapis.com/books/v1/volumes',
    qs: { q: bookName, maxResults: '40' },
    json: true,
    headers: 
     { 'postman-token': '1875b010-e575-40c6-016f-a2fa8a6a7452',
       'cache-control': 'no-cache' } };

    request(options)
    .then(function (response) {
        
        var data=[];
        
        var allbook =response.items;
        for (var i in allbook){
            var tempBook ={};
                 if(allbook[i].volumeInfo.authors == undefined){
                    authors = "unknown";
                 }
                 else {
                    authors =allbook[i].volumeInfo.authors[0]
                 }
                 if(allbook[i].volumeInfo.imageLinks == undefined){
                    imageLinks = "http://www.firemagicgrills.com/wp-content/uploads/accessories-small-placeholder.jpg";
                 }
                 else {
                    imageLinks =allbook[i].volumeInfo.imageLinks.smallThumbnail;
                 }               
                var tempBook = {
                    "title": allbook[i].volumeInfo.title,
                    "subtitle":allbook[i].volumeInfo.subtitle,
                    "authors":authors,
                    "image":imageLinks
                  }; 
                  data.push(tempBook);
               
        
            };
            console.log("BOOK API END");
            return res.send({success:true,books:data});
        

    
    })
    .catch(function (err) {
        console.log(err);
    return res.send({success:false,reason:"No such book in google book"});
    })
});  
app.route('/api/createbook')
.post(isLoggedIn, function (req, res) {
     
    var bookData = req.body;
    bookData._creator=req.session.user._id;
    console.log(bookData._creator);
    console.log(bookData.title);
  
    Book.create(bookData, function(err, book) {
      if(err) {
        console.log("err!!!")
        if(err.toString().indexOf('E11000') > -1) {
          err = new Error('Duplicate Username');
        }
        res.status(400);
        return res.send({reason:err.toString()});
      }
     
      return res.send({success:true, books: book});
        
      })

 
});
app.route('/api/updatebook')
.post(isLoggedIn,function(req, res){
    console.log("UPDATE BOOK API");
    if(req.body.status== 2){
        var statusChangedTo = 0;
    }
    else{
        var statusChangedTo =req.body.status;
    }
    var transactionData = {
        book:null,
        buyer:req.body.buyer,
        owner:null,
        transactionStatus:req.body.transaction,

    }
    Book.findById(req.body._id, function (err, book){
        console.log(err);
        console.log("Bookd founded");
        console.log(book);
        transactionData.book = book.title;
        User.findById(req.body.owner, function (err, user){
            
            console.log(err);
             console.log("Bookd founded");
             console.log(book);
        transactionData.owner=user.username;
        console.log("In API");
        console.log("bookSelected   "+transactionData.book);
        console.log("buyer   "+req.body.buyer);
        console.log("status changed to    "+ statusChangedTo)
        console.log("owner    "+ transactionData.owner)
        var bookselected = req.body._id;
        console.log("bookselected   "+ bookselected);
        var conditions = { "_id": bookselected }
        , update = { $set: { status: statusChangedTo,buyer: req.body.buyer}}
    
      console.log(transactionData);
      Book.update(conditions, update,function (err, raw) {
      
        console.log('The raw response from Mongo was ', raw);
        if (err) {
            return console.log(err);
        }
        else{
            if((req.body.status==2) ||(req.body.status== 1))
            {
                
                Transaction.create(transactionData, function(err, transaction) {
                    if(err) {
                      console.log("err!!!")
                      if(err.toString().indexOf('E11000') > -1) {
                        err = new Error('Duplicate Username');
                      }
                      res.status(400);
                      return res.send({reason:err.toString()});
                    }                 
                    })
           
    
            }
            
    
            return res.send({success:true});
        }
      
    });
    })
    
      });

    });
  
  
    app.route('/api/book/:id')
    .delete(isLoggedIn, function (req, res, next) {
        book.findById(req.params.id, function (err, book) {
            book.remove(function (err, book) {
                if (err) {
                    res.send(err);
                }
                book
                    .find({'_creator': req.session.user._id})
                    .exec(function (err, books) {
                        if (err) {
                            res.send(err);
                        }
                        return res.send({success:true, books: books});
                    });
            })
        })
    });     

 app.route('*')
.get(function (req, res) {
    res.sendFile(path + '/public/views/index.html');
});        

}