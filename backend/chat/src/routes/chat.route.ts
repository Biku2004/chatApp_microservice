import express, { Router } from "express"
import isAuth from "../middlewares/isAuth.middleware.js";
import { createNewChat, getAllChats, getMessagesByChat, sendMessage } from "../controllers/chat.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.post("/chat/new",isAuth,createNewChat);
router.get("/chat/all",isAuth,getAllChats);
router.post("/message",isAuth,upload.single('image'),sendMessage);
router.get("/message/:chatId",isAuth,getMessagesByChat);

export default router;