import { Schema, model } from 'mongoose'

const RequiredString = {
  type:String,
  required:true,
  unique:true
}

const userSchema = new Schema({
  username: RequiredString,
  email:RequiredString,
  password:RequiredString
})

export const User = model('user',userSchema)
