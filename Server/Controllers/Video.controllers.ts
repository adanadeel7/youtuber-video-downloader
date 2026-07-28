import ytdl from "youtube-dl-exec";
import { Video } from "../models/video.model.ts";
import path from "node:path";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getVideoInfo = async (req: any, res: any) => {
  try {
    // Getting URL From Body
    const { url } = req.body;
    // URL Check
    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    const cleanURL = url.trim();
    const ytRegex = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/;
    if (!ytRegex.test(cleanURL)) {
      return res.status(400).json({ error: "Invalid Youtube URL" });
    }

    console.log(`Attempting to get info for ${cleanURL}`);

    const info: any = await ytdl(cleanURL, {
      dumpSingleJson: true,
      noWarnings: true,
      callHome: false,
      preferFreeFormats: true,
      youtubeSkipDashManifest: true,
    });

    const videoDetails = await Video.create({
      title: info.title || "Unknown Title",
      thumbnail: info.thumbnail || "",
      duration: info.duration ? String(info.duration) : "0", // Convert duration to string
      author: info.uploader || "Unknown Author",
      viewCount: info.view_count ? String(info.view_count) : "0", // Convert view count to string
      description: info.description
        ? info.description.substring(0, 200) + "..."
        : "No description available.",
    });

    console.log(`Successfully got info for: ${videoDetails.title}`);
    res.json({ success: true, data: videoDetails });
  } catch (err: any) {
    console.error("Error getting video info:", err.message);
    console.error("Full error:", err);
    res.status(500).json({
      error: "Failed to get video information",
      details: err.message,
    });
  }
};

const downloadVideo = async (req: any, res: any) => {
  try {
    
    const { url, quality, format } = req.body;

    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    const cleanUrl = url.trim();
    const ytRegex = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/;

    if (!ytRegex.test(cleanUrl)) {
      return res.status(400).json({ error: "Invalid Youtube URL" });
    }

    console.log(`Starting download for: ${cleanUrl}`);

    const info: any = await ytdl(cleanUrl, {
      dumpSingleJson: true,
      noWarnings: true,
      callHome: true, 
      preferFreeFormats: true,
      youtubeSkipDashManifest: true,
    });

    const title = info.title.replace(/[^\w\s\-_]/gi, "");
    const fileName = `${title}_${Date.now()}.${format || "mp4"}`;
    const downloadsDir = path.join(__dirname, "../downloads");
    if (!fs.existsSync(downloadsDir)) {
      fs.mkdirSync(downloadsDir, { recursive: true });
    }
    const filePath = path.join(downloadsDir, fileName);

    if (format === "mp3") {
      console.log("Downloading and converting to MP3...");

      // FIX: Just await the function. No streams needed! 
      // yt-dlp automatically handles the FFmpeg conversion here.
      await ytdl(cleanUrl, {
        extractAudio: true,
        audioFormat: "mp3",
        output: filePath,
        noWarnings: true,
        callHome: true,
      });

      console.log(`Audio Download Completed: ${fileName}`);
      
      // Send to user, then delete from server to save space
      res.download(filePath, fileName, (err: any) => {
        if (!err) fs.unlink(filePath, () => console.log("Cleaned up file"));
      });

    } else { 
      // Download Video 
      console.log("Downloading video and merging audio...");

      // Determine quality string for yt-dlp
      let formatQuery = "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best"; 
      if (quality === "low") {
        formatQuery = "worstvideo[ext=mp4]+worstaudio[ext=m4a]/worst[ext=mp4]/worst";
      } else if (quality === "medium") {
        formatQuery = "bestvideo[height<=720][ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best";
      }

      await ytdl(cleanUrl, {
        format: formatQuery,
        mergeOutputFormat: 'mp4',
        output: filePath,
        noWarnings: true,
        callHome: true
      });

      console.log(`Video Download Completed: ${fileName}`);
      
      res.download(filePath, fileName, (err: any) => {
        if (!err) fs.unlink(filePath, () => console.log("Cleaned up file"));
      });
    }

  } catch (err: any) {
    console.error("Download Error:", err.message);
    res.status(500).json({ error: "Failed to process download", details: err.message });
  }
};

export { getVideoInfo, downloadVideo };
