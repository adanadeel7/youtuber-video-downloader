import express from "express";
import { getVideoInfo,downloadVideo } from "../Controllers/Video.controllers.ts";


const router = express.Router()

router.post("/getvideoinfo", getVideoInfo)
router.post("/downloadvideo", downloadVideo)



export default router; 