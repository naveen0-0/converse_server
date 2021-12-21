const { Schema, model } = require('mongoose')
const { v4: uuidv4 } = require('uuid')

const RequiredString = {
  type:String,
  required:true,
}

const userSchema = new Schema({
  username: RequiredString,
  email:RequiredString,
  password:RequiredString,
  chatId:{
    type:String,
    required:true,
    default:uuidv4()
  }
})

const User = model('user',userSchema)

module.exports = User
