const { Friends } = require('../models/Friends')
const { User } = require('../models/User')
const { Group } = require('../models/Group')


const socketIoLogic = (io) => {
  io.on('connection', (socket) => {
    socket.join(socket.handshake.query.chatId);

    
    //@ Send Friend Request
    socket.on("friend_request", async data => {
      let { username, friendUsername, chatId, friendChatId } = data;

      let friends = await Friends.create({
        friend1 : username,
        friend2 : friendUsername,
        chatId1 : chatId,
        chatId2 : friendChatId,
        whoRequested : username,
        whoAccepted : friendUsername
      })

      socket.emit('friend_request_sender', friends);
      socket.broadcast.to(data.friendChatId).emit('friend_request_receiver', friends)
    })

    //@ Accepting Friend Request
    socket.on("accept_friend_request", async data => {
      const { friendChatId, id } = data;
      let friends = await Friends.updateOne({ _id: id },{ requestAcceptedOrNot : true })
      socket.emit('friend_request_accepted_sender', id);
      socket.broadcast.to(friendChatId).emit('friend_request_accepted_receiver', id)
    })

    //@ Declining Friend Request
    socket.on("decline_friend_request", async data => {
      const { friendChatId, id } = data;
      let friends = await Friends.deleteOne({ _id: id })
      socket.emit('friend_request_declined_sender', id);
      socket.broadcast.to(friendChatId).emit('friend_request_declined_receiver', id)
    })
    
    //@ Sending Messages
    socket.on("send_msg", async data => {
      const { id, sender, receiver, message, time, chatId, friendChatId } = data;
      //@ Todo Append a message
      let msgInsert = await Friends.updateOne({ _id: id },{ 
        $push: { messages : { sender, receiver, message, time } }
      })
      socket.emit('send_msg_sender', { id : id, info : { sender , receiver, message, time } });
      socket.broadcast.to(friendChatId).emit('send_msg_receiver', { id : id, info : { sender , receiver, message, time } })
    })
    
    //@ Groups Logic    
    socket.on('join_groups', async data => {
      const { username } = data;
      let { groupIds } = await User.findOne({ username })
      for( let index = 0; index < groupIds.length; index++ ) {
        socket.join(groupIds[index].groupId)
      }
    })


    socket.on('join_the_created_room', async data => {
      socket.join(data)
    })

    //@ Groups Sending Messages
    socket.on('group_send_msg', async data => {
      const { groupId, sender, message, time } = data;
      let msgInsert = await Group.updateOne({ groupId },{ 
        $push: { messages : { sender, message, time } }
      })
      io.to(groupId).emit('group_send_msg', data);
    })

    //@ Adding someone to the group
    socket.on('add_user_to_the_group', async data => {

      const { chatId, username, groupId } = data;
      let userWithThatName = await Group.findOne({ 
        $and : [
          { groupId : groupId },
          { $or : [
            { admin : username },
            { users : { $elemMatch : { username : username } }}
          ]}
        ]
      })


      if(userWithThatName === null){
        let userInsert = await Group.updateOne({ groupId },{ $push: { users : { username, role:"member" }} })
        let groupIdInsert = await User.updateOne({ username },{ $push: { groupIds : { groupId }} })
          
        socket.broadcast.to(chatId).emit('add_user_to_the_group', data)
        io.to(groupId).emit('add_user_to_the_group_in_redux', data)
      }

    })
    
      
    socket.on('add_user_to_the_group_success', async data => {
      const { chatId, username, groupId } = data;
      socket.join(groupId)
      let group = await Group.findOne({ groupId })

      socket.emit('add_group_to_the_user_in_redux', group)
    })
    
    socket.on('disconnect', () => { console.log('user disconnected') })
  });
}


module.exports = {
  socketIoLogic
}