const chatController = require("../controller/chat.controller");
const userController = require("../controller/user.controller");

const userSocketMap = new Map();

module.exports = (io) => {

io.on("connection", (socket) => {
    console.log("a user connected", socket.id);
  
    socket.on('get_user_id', async (param) => {
      userId = param.userId;
      const userExists = await userController.findUserByIdForIndividual(userId);
      if(userExists.status === 1){
        userSocketMap.set(userId, socket.id);
        console.log("============")
        console.log(userSocketMap);
  
        socket.on('get_conversation', async (param) => {
          const previousConversations = await chatController.getPreviousConversations(param);
          console.log("=======>>>>>", previousConversations);
          if(previousConversations.status == "Success"){
            socket.emit('previous_conversations', previousConversations.data);
          }
      });
  
      } else {
        console.log("User not found");
      }
      
    });
  
    socket.on('join_group', () => {
      socket.join('room1');
      socket.emit('user_joined_group', 'You have joined the group');
    });
  
    socket.on('group_message', ({ senderId, message }) => {
      io.to('room1').emit('group_message', { senderId, message });
    });
  
    socket.on('private_message', (param) => {
      const { senderId, recipientId, message } = param;
  
      const senderSocketId = getSocketIdByUserId(senderId);
      const recieverSocketId = getSocketIdByUserId(recipientId);
      console.log(`Socket ID for user ${senderId}:`, senderSocketId);
      console.log(`Socket ID for user ${recipientId}:`, recieverSocketId);
      
  
      io.to(recieverSocketId).emit('private_message', { senderId, message });
      io.to(senderSocketId).emit('private_message', { senderId, message });
  
      console.log(`senderId ====> ${senderId}`);
      console.log(`recieverId ====> ${recipientId}`);
  
      chatController.createMessage(param);
  
  
      function getSocketIdByUserId(targetUserId) {
        let socketId;
  
        for (const [userId, id] of userSocketMap.entries()) {
          if (userId === targetUserId) {
            socketId = id;
            break;
          }
        }
  
        return socketId;
      }
  
    });
  
    socket.on("disconnect", () => {
      for (const [userId, socketId] of userSocketMap) {
        if (socketId === socket.id) {
          userSocketMap.delete(userId);
          break;
        }
      }
      console.log(userSocketMap);
      console.log("user disconnected");
    });
  
    // socket.join('room1');
    // socket.on("group message", (msg) => {
    //   io.to('room1').emit('group message', msg);  
    // });
  
    // socket.on("chat message", (msg) => {
    //   io.emit("chat message", msg);
    //   // socket.broadcast.emit("chat message", msg);
    // });
  });

};
