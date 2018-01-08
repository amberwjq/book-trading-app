

var mongoose =require('mongoose');
var Schema = mongoose.Schema;

var  BookSchema = new Schema(
{
  title:String,
  authors:String,
  image:String,
  _creator : { type: Schema.Types.ObjectId, ref: 'User' },
  created_at: { type: Date, default: Date.now },
  buyer:String,
  status:{
    type:Number,
    default:0
  },
  // status 
  // 0: idle;
  // 1: approved;
  // 2:denied; after denied,will change status to 0 again
  // 3:pending;
  

});

   

var Book = mongoose.model('Book', BookSchema);


Book.find({}).exec(function(err, collection) {
if(collection.length === 0) {

  Book.create({
    title:"Fantastic Beasts and Where to Find Them: The Original Screenplay",
    authors:"J.K. Rowling",
    image:"http://books.google.com/books/content?id=DU0LDAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
    });

 }
})

module.exports=Book
