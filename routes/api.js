const router = require('express').Router();
const { User } = require('../models/User')
const { Friends } = require('../models/Friends')
const { Group } = require('../models/Group')

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
  let friends = await Friends.find({ $or: [ { friend1:username }, { friend2: username } ] })
  res.json(friends)
})

//@ Creating a group
router.route('/create_group').post(async (req,res) => {
  const { username, groupId, groupName } = req.body
  const group = await Group.findOne({ groupName })
  if( group !== null ) return res.send({ operation : false, feedback : "Group name taken" })
  const newGroup = await Group.create({ groupName, groupId, admin: username })

  let groupIdInsert = await User.updateOne({ username : username },{ 
    $push: { groupIds : { groupId } }
  })
  return res.send({ operation: true, group: newGroup })
})


//* Fetch All Groups
router.route('/groups').post(async (req,res) => {
  const { username } = req.body
  let groups = await Group.find( { $or: [
    { admin: username }, 
    { users : { username : username }} 
  ]})

  res.json(groups)
})

router.route('/add_to_group').post(async (req,res) => {
  const { name, groupId } = req.body
  const user = await User.findOne({ username : name })

  if(user === null) return res.send({ operation : false, feedback : "No User With That Name" })
  let userWithThatName = await Group.findOne({ 
    $and : [
      { groupId : groupId },
      { $or : [
        { admin : name },
        { users : { username : name }}
      ]}
    ]
  })


  if(userWithThatName === null) return res.send({ operation : true, user: { chatId : user.chatId, username : user.username } })
  return res.send({ operation : false , feedback : "Already in the group" })
})









module.exports = router
