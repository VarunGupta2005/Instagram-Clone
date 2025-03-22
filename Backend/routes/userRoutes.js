import express from 'express'
import editProfile from '../controllers/userControllers/editProfile.js'
import upload from '../utils/multer.js'
import authenticate from "../middlewares/auth.js"
import follow from '../controllers/userControllers/follow.js'
import path from "path";
import checkMail from '../middlewares/emailAuth.js';
import sendMail from '../middlewares/mail.js';
import { fileURLToPath } from "url";
import handleRequest from "../controllers/userControllers/managereq.js";
import remove from '../controllers/userControllers/removefollower.js'
import reset from '../controllers/userControllers/resetpass.js';
import { createCookie } from '../middlewares/cookiemaker.js';
import signin from "../controllers/userControllers/signinfun.js";
import signup from '../controllers/userControllers/signupfun.js';
import getSuggestedUsers from '../controllers/userControllers/suggestUsers.js';
import unfollow from '../controllers/userControllers/unfollow.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



const router = express.Router();

router.get('/forgot', (req, res) => { res.sendFile(path.join(__dirname, '../static/forgotpass.html')) })
router.post('/forgot', checkMail, sendMail, (req, res) => { res.render('../views/forgotpass.ejs', { email: req.body.email }); });
router.patch('/editProfile', authenticate, upload.single("ProfilePicture"), editProfile);
router.patch('/follow', authenticate, follow);
router.patch("/handleRequest", authenticate, handleRequest);
router.get('/', authenticate, (req, res) => { res.render("../views/home.ejs", { user: req.username }) })
router.patch('/removeFollower', authenticate, remove);
router.get("/signin", (req, res) => { res.sendFile(path.join(__dirname, "../static/signin.html")); });
router.post("/signin", signin, createCookie);
router.get('/signup', (req, res) => { res.sendFile(path.join(__dirname, '../static/signup.html')) })
router.post('/signup', signup, createCookie);
router.get('/getSuggestions', authenticate, getSuggestedUsers);
router.patch('/unfollow', authenticate, unfollow);
router.get('/reset-password/:token', (req, res) => {
  const token = req.params.token;
  res.render("resetpass.ejs", { token: token });
})
router.post('/reset-password', reset);


export default router;