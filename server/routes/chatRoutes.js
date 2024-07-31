const express = require("express");
const app = express();
const upload = require("../middlewares/fileStorage");
const authMiddleware = require("../middlewares/auth");
const router = express.Router();

const {
  addChat,
  getChats,
  getSpecificChat,
} = require("../controllers/chatsController");

// router.use(authMiddleware);
router.post("/chat", authMiddleware, addChat);
router.get("/chats", authMiddleware, getChats);
router.get("/chat/:receiver", authMiddleware, getSpecificChat);

module.exports = router;
