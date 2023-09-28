import express from "express";
import dotenv from "dotenv";
import chats from "./data/data.js";

const app = express();
dotenv.config();

app.get("/", (req, res) => {
  res.send("API is working fine.");
});

app.get("/api/chat", (req, res) => {
  res.send(chats);
});

app.get("/api/chat/:id", (req, res) => {
  const singleChat = chats.find((c) => c._id === req.params.id);
  res.send(singleChat);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server is running on port ${PORT}`));
