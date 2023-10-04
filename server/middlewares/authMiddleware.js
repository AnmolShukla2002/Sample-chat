import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

export const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await userModel.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      res.status(401).send({
        success: false,
        messaege: "Not Authorized, token failed",
        error,
      });
    }
  }
  if (!token) {
    res.status(401).send({
      success: false,
      message: "Not Authorized, no token",
      error,
    });
  }
};