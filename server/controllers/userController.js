import userModel from "../models/userModel.js";
import { generateToken } from "../config/generateToken.js";
import { comparePassword, hashPassword } from "../helpers/authHelper.js";

export const registerController = async (req, res) => {
  try {
    const { name, email, password, pic } = req.body;

    if (!name || !email || !password) {
      res.send({ message: "Fill all the required fields" });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      res.status(400).send({
        success: false,
        message: "User Already Registered. Kindly Login!",
      });
    }

    const hashedPassword = await hashPassword(password);

    const user = await new userModel({
      name,
      email,
      password: hashedPassword,
      pic,
    }).save();

    const token = generateToken(user._id);
    res.status(201).send({
      success: true,
      message: "User Registered Successfulyy",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in registration",
      error,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(406).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registered",
      });
    }

    const match = await comparePassword(password, user.password);
    if (!match) {
      res.status(404).send({
        success: false,
        message: "Invalid password",
      });
    }

    res.status(200).send({
      success: true,
      message: "Login Successfull",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Login",
      error,
    });
  }
};

export const allUsersController = async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await userModel
    .find(keyword)
    .find({ _id: { $ne: req.user._id } });
  res.send(users);
};
