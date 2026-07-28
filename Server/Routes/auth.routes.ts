import express from "express";
import { Register,Login,logoutUser } from "../Controllers/auth.controllers.ts";

const router = express.Router()

router.post("/register", Register)
router.post("/login", Login)
router.post("/logout", logoutUser)


export default router; 