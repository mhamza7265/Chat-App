const Chat = require("../models/chatModel");

const addChat = async (socket, data) => {
  const email1 = socket.headers.email;
  const email2 = data.receiver;
  try {
    const users = await Chat.aggregate([
      { $match: { users: { $eq: email1 } } },
      { $match: { users: { $eq: email2 } } },
    ]);
    const date = new Date();
    if (users.length < 1) {
      const chat = await Chat.create({
        users: [email1, email2],
        userIds: [socket.headers.id, data.userId],
        name: [
          data.name,
          socket.headers.firstName + " " + socket.headers.lastName,
        ],
        image: {
          [email1.replaceAll(".", "")]: data.image1,
          [email2.replaceAll(".", "")]: data.image2,
        },
        date: date.toISOString(),
      });
      return { status: true, message: "chat created!", chat };
    } else {
      const updated = await Chat.updateOne(
        { _id: users[0]._id },
        { date: date.toISOString() }
      );
      if (updated.acknowledged) {
        const chat = await Chat.find({ users: req.headers.email });

        return { status: true, message: "Chat date updated!", chat };
      }
    }
  } catch (err) {
    return { status: false, error: "Internal server error" };
  }
};

const getChats = async (socket, data) => {
  try {
    const chats = await Chat.find({ users: socket.headers.email });
    return { status: true, chats };
  } catch (err) {
    return { status: false, error: "Internal server error" };
  }
};

const getReceiversChats = async (socket, data) => {
  try {
    const chats = await Chats.find({ users: data.receiver });
    return { status: true, chats };
  } catch (err) {
    return { status: false, error: "Internal server error" };
  }
};

const getSpecificChat = async (socket, data) => {
  try {
    const user = await Chat.aggregate([
      { $match: { users: { $eq: socket.headers.email } } },
      { $match: { users: { $eq: data.receiver } } },
    ]);
    if (user.length > 0) {
      return { status: true, user: user[0] };
    } else {
      return { status: false, error: "No chat found!" };
    }
  } catch (err) {
    return { status: false, error: "Internal server error" };
  }
};

module.exports = { addChat, getChats, getReceiversChats, getSpecificChat };
