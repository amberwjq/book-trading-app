var mongoose =require('mongoose');
var Schema = mongoose.Schema;

var  TransactionSchema = new Schema(
{
  book:String,
  buyer:String,
  owner: String,
  transactionDate:{ type: Date, default: Date.now },
  transactionStatus:String,
});

   

var Transaction = mongoose.model('Transaction', TransactionSchema);


module.exports=Transaction
