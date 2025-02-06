import express from "express";
import handleRequest from "../controllers/managereq.js";

const router = express.Router();

router.get("/", handleRequest);

export default router;
