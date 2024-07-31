const Messages = require("../models/messagesModel.js");

const addMessage = async (socket, data) => {
  console.log("dataMessage", data);
  try {
    const message = await Messages.create({
      chatId: data.chatId,
      messageId: data.messageId,
      sender: socket.headers.email,
      senderId: socket.headers.id,
      message: data.message,
      time: new Date().toISOString(),
      status: "unread",
      success: true,
    });
    return { status: true, message, msg: "Message saved successfullt" };
  } catch (err) {
    return { status: false, error: "Internal server error" };
  }
};

const getMessages = async (socket, data) => {
  const currentPage = data.page;
  let page = 1;
  const limit = 15;
  const sort = { time: -1 };
  if (currentPage) page = currentPage;
  try {
    const messages = await Messages.paginate(
      { chatId: data.chatId },
      { page, limit, sort }
    );
    const messagesArray = messages.docs;
    messagesArray.reverse();
    const msgs = { ...messages, docs: [...messagesArray] };
    return { status: true, messages: msgs };
  } catch (err) {
    return { status: false, error: "Internal server error" };
  }
};

const updateMessageStatus = async (socket, data) => {
  const currentPage = data.page;
  let page = 1;
  const limit = 15;
  const sort = { time: -1 };
  if (currentPage) page = currentPage;
  try {
    const updated = await Messages.updateMany(
      { messageId: data.messageId },
      { status: "read" }
    );
    if (updated.acknowledged) {
      const messages = await Messages.paginate(
        { chatId: data.chatId },
        { page, limit, sort }
      );
      const messagesArray = messages.docs;
      messagesArray.reverse();
      const msgs = { ...messages, docs: [...messagesArray] };
      return { status: true, messages: msgs };
    }
  } catch (err) {
    return { status: false, error: "Internal server error" };
  }
};

const deleteMessage = async (socket, data) => {
  try {
    const message = await Messages.findOne({ messageId: data.messageId });
    if (message.sender == socket.headers.email) {
      const deleted = await Messages.deleteOne({ messageId: data.messageId });
      if (deleted.acknowledged) {
        return { status: true, messageId: data.messageId };
      }
    } else {
      return { status: false, error: "Not authorized" };
    }
  } catch (err) {
    return { status: false, error: "Internal server error" };
  }
};

module.exports = {
  addMessage,
  getMessages,
  updateMessageStatus,
  deleteMessage,
};
