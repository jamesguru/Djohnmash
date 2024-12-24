import express from "express";
import { loginUser, logOut, registerUser } from "../controllers/authController.js";
const router = express.Router();

// REGISTER USER ROUTER
router.post("/register", registerUser);

//LOGIN USER ROUTER
router.post("/login", loginUser);

// LOGOUT USER
router.get("/logout", logOut);

export default router;