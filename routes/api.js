const router = require('express').Router();
const { User } = require('../models/User')
const { Friends } = require('../models/Friends')

router.route('/search').post(async (req,res) => {
  const { text, user } = req.body;
  if(text === user) return res.send({ statusnum: 1, feedback : "Nothing to show", user:null })

  let thisuser = await User.findOne({ username : text })
  if(thisuser === null) return res.send({ statusnum: 1, feedback : "Nothing to show", user:null })

  // If Yes do something
  const friendsOrNot = await Friends.findOne({friend1 : {$in : [ text, user ]}, friend2 : {$in : [ text, user ]}})
  if(friendsOrNot === null) return res.send({ statusnum: 2, user : { username : thisuser.username, chatId:thisuser.chatId }, feedback:"send"})

  if(friendsOrNot.requestAcceptedOrNot) return res.send({ statusnum: 3, feedback : "Friends", user:{ username : thisuser.username, chatId:thisuser.chatId }})
  // If There is already a friend request and the one who searched is the one who requested
  if(friendsOrNot.whoRequested === user) return res.send({ statusnum: 4, feedback : "Request Sent", user:{ username : thisuser.username, chatId:thisuser.chatId }})

  // If There is already a friend request and the one who searched is not the one who requested
  return res.send({ statusnum: 4, feedback : "Request Pending", user:{ username : thisuser.username, chatId:thisuser.chatId }})
})


router.route('/friends').post(async (req,res) => {
  const { username } = req.body;
  let friends = await Friends.find( { $or: [ { friend1:username }, { friend2: username } ] },{ messages :0 } )
  res.json(friends)
})

router.route('/messages').post(async (req,res) => {
  const { selectedFriendsId } = req.body;
  let messagesObj = await Friends.findOne({ _id : selectedFriendsId }, { messages : 1, _id : 0 })
  if(messagesObj === null){
    return res.json([])
  }
  res.json(messagesObj.messages)
})













module.exports = router
