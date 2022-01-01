const { Schema, model } = require('mongoose')

const RequiredString = {
  type:String,
  required:true,
}

const groupIdsSchema = new Schema({
  groupId:RequiredString
})

const userSchema = new Schema({
  username: RequiredString,
  email:RequiredString,
  password:RequiredString,
  chatId: RequiredString,
  groupIds:[groupIdsSchema]
})

const User = model('user',userSchema)

module.exports = {
  User
}
