const express = require("express");
const router = express.Router();
const path = require("path");
const signin = require("../controllers/signinfun");

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../static/signin.html"));
});

router.post("/",signin);

module.exports = router;
