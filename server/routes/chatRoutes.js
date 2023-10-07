import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { accessChat } from "../controllers/chatController.js";

const router = express.Router();

router.post("/", protect, accessChat);
// router.get("/", protect, fetchChats);
// router.post("/group", protect, createGroupChat);
// router.put("/rename", protect, renameGroup);
// router.put("/groupremove", protect, removeFromGroup);
// router.put("/groupadd", protect, addToGroup);

export default router;
