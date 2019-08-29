const express = require("express");
const router = express.Router();
const login = require("../../MongoQueries/userQueries").readUser;
const newUser = require("../../MongoQueries/userQueries").addNewUser;
const jwt = require("jsonwebtoken");

//@route    GET /api/users/test
//@desc     Tests user route
//@access   Public
router.get("/test", (req, res) => {
  res.json({ msg: "User Works" });
});

//@route    POST /api/users/login
//@desc     login route
//@access   Public
router.post("/login", async (req, res) => {
  const returnData = {};
  try {
    const result = await login(req.body);
    if (result) {
      jwt.sign({ result }, "misJwtKey", { expiresIn: 60*60 }, (err, token) => {
        returnData.token = token;
        returnData.status = 1;
        returnData.msg = "Login Success";
        res.status(200).json(returnData);
      });
    } else {
      throw err;
    }
  } catch (err) {
    console.log("err :" + err);
    returnData.token = "";
    returnData.status = 0;
    returnData.msg = "Invalid Username/Password";
    return res.status(403).json(returnData);
  }
});

module.exports = router;
