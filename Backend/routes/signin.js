import express from "express";
const router = express.Router();
import path from "path";
import {createCookie} from '../middlewares/cookiemaker.js';
import signin from "../controllers/signinfun.js";
import { fileURLToPath } from "url"; 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
router.get("/", (req, res) => {
  // res.send("hello")
  res.sendFile(path.join(__dirname, "../static/signin.html"));
});

router.post("/",signin,createCookie);

export default router;
