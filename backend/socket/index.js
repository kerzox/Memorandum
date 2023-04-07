const { Server } = require("socket.io");
const moment = require("moment-timezone");

const io = new Server(27005, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    transports: ["websocket", "polling"],
  },
});

let users = [];

const addUser = ({ id, username }, socketId) => {
  removeUserByUserId(id);
  users.push({ id, username, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const removeUserByUserId = (userId) => {
  users = users.filter((user) => user.id !== userId);
};

const getUserIdFromSocket = (socketId) => {
  for (let i = 0; i < users.length; i++) {
    if (users[i].socketId === socketId) {
      return users[i].id;
    }
  }
};

const getUser = (user) => {
  for (let i = 0; i < users.length; i++) {
    if (users[i].id === user) {
      return users[i].socketId;
    }
  }
};

const getUserAccount = (user) => {
  for (let i = 0; i < users.length; i++) {
    if (users[i].id === user) {
      return users[i];
    }
  }
};

const usersExists = (user) => {
  for (let i = 0; i < users.length; i++) {
    if (users[i].id === user) {
      return true;
    }
  }
};

const sendUsersArr = () => {
  io.emit("event", {
    type: "update_users",
    data: {
      all_online_users: users,
      amount: users.length,
    },
  });
};

const sendEventToAll = (event, data) => {
  io.emit("event", {
    type: event,
    data,
  });
};

const sendEventToSpecified = (event, id, data) => {
  io.to(id).emit("event", {
    type: event,
    data,
  });
};

const sendToSpecified = (event, id, data) => {
  io.to(id).emit(event, {
    data,
  });
};

// this can be a socket id or a room

const causeGenericUpdateToSpecified = (id) => {
  io.to(id).emit("event", {
    type: "update",
  });
};

io.on("connection", (socket) => {
  socket.on("newUser", (user) => {
    addUser(user, socket.id);
    sendUsersArr();
  });

  socket.on("get_online_users", (user) => {
    sendUsersArr();
  });

  socket.on("get_user", (id, callback) => {
    callback({
      user: getUserAccount(id),
    });
  });

  socket.on("get_public_key", ({ sender_id, recipient }, callback) => {
    const getKey = async (id) => {
      try {
        let res = await fetch(`http://localhost:25565/users/${id}`);
        const data = await res.json();

        if (res.status === 200) {
          callback({
            data,
          });
        }
      } catch (err) {
        console.log(err);
      }
    };
    console.log(recipient);
    getKey(recipient);
  });

  socket.on("friend_request", ({ recipient_id, sender, response }) => {
    console.log(getUser(recipient_id));
    if (response) {
      io.to(getUser(recipient_id)).emit("event", {
        type: "friend_request",
        data: {
          response: true,
          sender,
        },
      });
    } else {
      io.to(getUser(recipient_id)).emit("event", {
        type: "friend_request",
        data: {

          response: false,
          sender,
        },
      });
    }
  });

  socket.on("open_conversation", (room) => {
    socket.join(room);
  });

  socket.on("send_message", ({ sender_id, recipient_id, room, text }) => {
    console.log("message being sent " + text);
    io.to(room).emit("event", {
      type: "private_message",
      message: {
        text: text,
        from: sender_id,
        to: recipient_id,
      },
    });
  });

  socket.on("cause_event", (event) => {
    console.log(event);
    if (event.header === "refresh_user") {
      if (event.recipient_id !== undefined)
        sendEventToSpecified(
          event.type,
          getUser(event.recipient_id),
          event.data
        );
    }
  });

  socket.on("logout", (user) => {
    removeUser(socket.id);
    sendUsersArr();
  });

  socket.on("disconnect", () => {
    sendLastOnline(getUserIdFromSocket(socket.id));
    removeUser(socket.id);
    sendUsersArr();
  });
});

const fetch = require("node-fetch");

const sendLastOnline = async (id) => {
  try {
    let res = await fetch(`http://localhost:25565/users/${id}/edit`, {
      method: "PUT",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lastOnline: moment().tz("Australia/Brisbane"),
      }),
    });
    const data = await res.json();

    if (res.status === 200) {
      console.log(data);
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = io;
