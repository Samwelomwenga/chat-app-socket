import { Server } from "socket.io";
type OnlineUser = {
  userId: string;
  socketId: string;
};
type Message = {
  _id: string;
  chatId: string;
  senderId: string;
  text: string;
  createdAt: string;
  updatedAt: string;
};
const io = new Server(5000, {
  cors: {
    origin: "http://localhost:5173",
  },
});
const onlineUsers: OnlineUser[] = [];
io.on("connection", (socket) => {
  console.log("socket id", socket.id);
  socket.on("join", (userId: string) => {
    !onlineUsers.some((user) => user.userId === userId) &&
      onlineUsers.push({
        userId,
        socketId: socket.id,
      });
    console.log("onlineUsers", onlineUsers);
    io.emit("getOnlineUsers", onlineUsers);
  });
  socket.on("sendMessage", ({message,recipientId}:{message:Message,recipientId:string})=>{
    const user=onlineUsers.find((onlineUser)=>onlineUser.userId===recipientId)
    user&&io.to(user.socketId).emit("getMessage",message)
  } ) 


  socket.on("disconnect", () => {
    onlineUsers.filter((user) => user.socketId !== socket.id);
    io.emit("getOnlineUsers", onlineUsers);
  });
});
