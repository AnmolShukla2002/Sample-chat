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
