const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Working");
});

const rooms = [];

io.on("connection", (socket) => {
  socket.on("create-new_room", ({ roomName, newRoomId }) => {
    rooms.push([newRoomId, roomName]);
    socket.broadcast.emit("add-new_rooms", [newRoomId, roomName]);
  });
  socket.on("get-rooms_list", () => {
    socket.emit("receive-rooms_list", rooms);
  });

  socket.on("join-room", ({ roomId, myId: userId }) => {
    socket.join(roomId);
    socket.broadcast.to(roomId).emit("user-connected", userId);
  });
});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
