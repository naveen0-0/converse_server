const router = require('express').Router()
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const { checkToken } = require('../middleware/middleware')

router.route('/signup').post( async (req,res) => {
  const { username, email, password } = req.body;

  const userWithThisUsername = await User.findOne({ username: username })
  if(userWithThisUsername) return res.send({ operation : false, feedback:"Username Taken" })

  const userWithThisEmail = await User.findOne({ email: email })
  if(userWithThisEmail) return res.send({ operation : false, feedback:"Email Already Exists" })
  
  await User.create({ username, email, password })
  return res.send({ operation :true,feedback:"Account Created Succesfully" })
})


router.route('/login').post( async (req,res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username: username })
  if(user === null) return res.send({ operation : false, feedback:"Username Doesn't Exists" })

  if(user.password !== password) return res.send({ operation : false, feedback:"Password Incorrect" })

  jwt.sign({ username : username },process.env.ACCESS_TOKEN,(err,token) => {
    if(err) return res.send({ operation: false, msg:"Error while creating token"})
    return res.send({ operation :true, feedback:"" ,user: { username: user.username, email:user.email, loggedIn:true, chatId:user.chatId }, token:token})
  })

})

router.route('/getuser').get(checkToken,async (req, res) => {
  const user = await User.findOne({ username: req.user.username })
  res.send({ operation : true, user: { username: user.username, email:user.email, loggedIn:true, chatId : user.chatId }})
})

module.exports = router;