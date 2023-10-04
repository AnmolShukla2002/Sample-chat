import express from "express";
import {
  allUsersController,
  loginController,
  registerController,
} from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.get("/search", protect, allUsersController);

export default router;
