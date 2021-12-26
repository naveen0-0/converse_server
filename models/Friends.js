const { Schema, model } = require('mongoose')

const messageSchema = new Schema({
  sender : { type: String , required: true },
  receiver : { type: String , required: true },
  message : { type: String, required: true },
  time : { type : Date, required:true, default : Date.now }
})

const friendsSchema = new Schema({
  friend1 : { type:String, required:true },
  friend2 : { type:String, required:true },
  chatId1 : { type:String, required:true },
  chatId2 : { type:String, required:true },
  whoRequested : { type:String, required:true },
  whoAccepted : { type:String, required:true },
  requestAcceptedOrNot: { type:Boolean, required:true, default:false },
  messages : [messageSchema]
})

const Friends = model('friends', friendsSchema)

module.exports = {
  Friends
}