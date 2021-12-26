const { Friends } = require('../models/Friends')

const socketIoLogic = (io) => {
  io.on('connection', (socket) => {
    console.log(socket.handshake.query.chatId);
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
      const { chatId, friendChatId, id } = data;
      let friends = await Friends.updateOne({ _id: id },{ requestAcceptedOrNot : true })
      socket.emit('friend_request_accepted_sender', id);
      socket.broadcast.to(friendChatId).emit('friend_request_accepted_receiver', id)
    })

    //@ Declining Friend Request
    socket.on("decline_friend_request", async data => {
      const { chatId, friendChatId, id } = data;
      let friends = await Friends.deleteOne({ _id: id })
      socket.emit('friend_request_declined_sender', id);
      socket.broadcast.to(friendChatId).emit('friend_request_declined_receiver', id)
    })
    
    
    socket.on('disconnect', () => { console.log('user disconnected') })
  });
}


module.exports = {
  socketIoLogic
}