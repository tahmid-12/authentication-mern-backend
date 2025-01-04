import express from "express";
import { signup,login,logout,verifyEmail,forgotPassword } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/verify-email", verifyEmail);

router.post("/logout", logout);

router.post("/forgot-password", forgotPassword);

export default router;