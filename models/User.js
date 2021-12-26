const { Schema, model } = require('mongoose')

const RequiredString = {
  type:String,
  required:true,
}

const userSchema = new Schema({
  username: RequiredString,
  email:RequiredString,
  password:RequiredString,
  chatId: RequiredString
})

const User = model('user',userSchema)

module.exports = {
  User
}
