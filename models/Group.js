const { Schema, model } = require('mongoose')

const RequiredString = {
  type:String,
  required:true,
}

const groupUserSchema = new Schema({
  username : RequiredString,
  role:RequiredString,
})

const groupMessagesSchema = new Schema({
  sender : RequiredString,
  message : RequiredString,
  time:{ type:Date, required:true }
})

const groupSchema = new Schema({
  groupName:RequiredString,
  groupId:RequiredString,
  admin:RequiredString,
  users : [groupUserSchema],
  messages : [groupMessagesSchema]
})

const Group = model('groups', groupSchema)

module.exports = {
  Group
}