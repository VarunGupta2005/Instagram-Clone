import express from "express";
import handleRequest from "../controllers/managereq.js";
import authenticate from "../middlewares/auth.js"
const router = express.Router();

router.patch("/",authenticate, handleRequest);

export default router;
