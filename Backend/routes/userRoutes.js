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
import signout from '../controllers/userControllers/signout.js'
import checkSignin from '../controllers/userControllers/checkSignin.js';
import profile from '../controllers/userControllers/getProfile.js';
import getReqs from '../controllers/userControllers/getFollowers.js';
import search from '../controllers/userControllers/search.js';
import getCons from '../controllers/userControllers/getConvs.js';
import fetchConversation from '../controllers/chatControllers/fetchConversation.js'
import createConversation from '../controllers/chatControllers/createConv.js';
import sendMessage from '../controllers/chatControllers/sendMessage.js'
import { getMessages } from '../controllers/chatControllers/fetchMessages.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



const router = express.Router();

router.get('/forgot', (req, res) => { res.sendFile(path.join(__dirname, '../static/forgotpass.html')) })
router.post('/forgot', checkMail, sendMail, (req, res) => { res.render('../views/forgotpass.ejs', { email: req.body.email }); });
router.patch('/editProfile', authenticate, upload.single("profilePicture"), editProfile);
router.patch('/follow', authenticate, follow);
router.patch("/handleRequest", authenticate, handleRequest);
router.get('/', authenticate, (req, res) => { res.render("../views/home.ejs", { user: req.username }) })
router.patch('/removeFollower', authenticate, remove);
router.get("/signin", (req, res) => { res.sendFile(path.join(__dirname, "../static/signin.html")); });
router.post("/signin", signin, createCookie);
router.get('/signup', (req, res) => { res.sendFile(path.join(__dirname, '../static/signup.html')) })
router.post('/signup', signup, createCookie);
router.get('/signout', authenticate, signout);
router.get('/getSuggestions', authenticate, getSuggestedUsers);
router.patch('/unfollow', authenticate, unfollow);
router.get('/reset-password/:token', (req, res) => {
  const token = req.params.token;
  res.render("resetpass.ejs", { token: token });
})
router.post('/reset-password', reset);
router.post('/verifyState', authenticate, checkSignin);
router.post('/profile/:username', authenticate, profile);
router.get('/getRequests', authenticate, getReqs);
router.get('/search', authenticate, search);
router.get('/getConvs', authenticate, getCons);
router.post('/fetchConversation', authenticate, fetchConversation);
router.post('/createConversation', authenticate, createConversation);
router.post('/sendMessage', authenticate, sendMessage);
router.post('/getMessages', authenticate, getMessages);

export default router;