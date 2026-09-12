import { Router } from "express";
import { loginUser, registerUser, verifyOtp } from "../controllers/auth.controller.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser)
router.route("/verify").post(verifyOtp)

export default router;