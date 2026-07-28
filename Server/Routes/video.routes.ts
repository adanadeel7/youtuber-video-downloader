import express from "express";
import { getVideoInfo, downloadVideo } from "../Controllers/Video.controllers.ts";

const router = express.Router();

router.post("/info", getVideoInfo);
router.post("/download", downloadVideo);

export default router;