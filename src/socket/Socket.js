import io from "socket.io-client";

let socket;

export const initSocketConnection = (user) => {
  if (user && user._id) {
    socket = io(
      `${process.env.REACT_APP_API_URL}`
      // "ws://localhost:3001"
      , {
      query: {
        userId: user._id,
      },
    });
    console.log("Socket initialized");
  }
};

export const sendMessage = (message) => {
  if (!socket) {
    initSocketConnection(JSON.parse(localStorage.getItem("user")));
  }

  console.log("sendMessage called", message);
  const data = socket.emit("sendMessage", message);
  console.log(data);
};

export const subscribeToMessages = (cb) => {
  if (!socket) {
    initSocketConnection(JSON.parse(localStorage.getItem("user")));
  }

  console.log("subscribeToMessages called");
  socket.off("reciveMessage");

  socket.on("reciveMessage", (message) => {
    console.log(message, "alkbfs message");

    cb(message);
  });
};

export const updateBadgeCount = (data) => {
  if (!socket) {
    initSocketConnection(JSON.parse(localStorage.getItem("user")));
  }
  console.log("badgeherr in socket", data);
  socket.emit("badgeCount", data);
};

export const subscribeToBadgeCount = (fn) => {
  if (!socket) {
    initSocketConnection(JSON.parse(localStorage.getItem("user")));
  }
  socket.off("badgeCount");
  socket.on("badgeCount", fn);
};

export const subscribeToConversationList = (fn) => {
  if (!socket) {
    initSocketConnection(JSON.parse(localStorage.getItem("user")));
  }
  socket.off("conversationList");
  socket.on("conversationList", fn);
};

export const userTyping = (data) => {
  if (!socket) {
    initSocketConnection(JSON.parse(localStorage.getItem("user")));
  }
  socket.emit("isTyping", data);
};

export const subscribeToIsTyping = (fn) => {
  if (!socket) {
    initSocketConnection(JSON.parse(localStorage.getItem("user")));
  }
  socket.off("isTyping");
  socket.on("isTyping", fn);
};

export const doneTyping = (data) => {
  if (!socket) {
    initSocketConnection(JSON.parse(localStorage.getItem("user")));
  }
  socket.emit("doneTyping", data);
};

export const subscribeToDoneTyping = (fn) => {
  if (!socket) {
    initSocketConnection(JSON.parse(localStorage.getItem("user")));
  }
  socket.off("doneTyping");
  socket.on("doneTyping", fn);
};
