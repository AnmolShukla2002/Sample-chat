import chatModel from "../models/chatModel.js";
import User from "../models/userModel.js";

export const accessChat = async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    console.log("UserId param not sent with the request");
    return res.sendStatus(400);
  }
  var isChat = await chatModel
    .find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });
  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };
    try {
      const createdChat = await chatModel.create(chatData);
      const fullChat = await chatModel
        .findOne({ _id: createdChat._id })
        .populate("users", "-password");
      res.status(200).send(fullChat);
    } catch (error) {
      res.status(400).send({ error });
    }
  }
};

export const fetchChats = async (req, res) => {
  try {
    chatModel
      .find({
        users: { $elemMatch: { $eq: req.user._id } },
      })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400).send({ error });
  }
};
//[ '6519dd8efdfb80bc93b2e15c', '651bd203a526685363bc2924' ]
export const createGroupChat = async (req, res) => {
  try {
    const { name, users } = req.body;
    if (!name || !users || !Array.isArray(users) || users.length < 2) {
      return res.status(400).json({ message: "Invalid data provided" });
    }

    const groupChat = await chatModel.create({
      chatName: name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });
    const fullGroupChat = await chatModel
      .findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    return res.status(200).json(fullGroupChat);
  } catch (error) {
    console.error("Error creating group chat:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const renameGroup = async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await chatModel
    .findByIdAndUpdate(
      chatId,
      {
        chatName: chatName,
      },
      {
        new: true,
      }
    )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404).send("Chat Not Found");
  } else {
    res.json(updatedChat);
  }
};

export const addToGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  const added = await chatModel
    .findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      {
        new: true,
      }
    )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    res.status(404).send("Chat Not Found");
  } else {
    res.json(added);
  }
};

export const removeFromGroup = async (req, res) => {
  const { chatId, userId } = req.body;
  const removed = await chatModel
    .findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      {
        new: true,
      }
    )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    res.status(404).send("Chat Not Found");
  } else {
    res.json(removed);
  }
};
