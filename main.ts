import { Server } from "socket.io";
type onlineUser = {
  userId: string;
  socketId: string;
};
const io = new Server(5000, {
  cors: {
    origin: "http://localhost:5173",
  },
});
const onlineUsers: onlineUser[] = [];
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
  socket.on("disconnect", () => {
    onlineUsers.filter((user) => user.socketId !== socket.id);
    io.emit("getOnlineUsers", onlineUsers);
  });
});
