const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
//@desc  Register user
//@route GET /api/users/register
//@access public 
const registerUser = asyncHandler(async (req, res) => {
    const {username, email,password} = req.body;
    if(!username || !email || !password) {
        res.status(400);
        throw new Error("all fields mandatory");
    }
    const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(400);
    throw new Error("User already registered!");
  }

  //Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("Hashed Password: ", hashedPassword);
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  console.log(`User created ${user}`);
  if (user) {
    res.status(201).json({ _id: user.id, email: user.email });
  } else {
    res.status(400);
    throw new Error("User data is not valid");
  }
  res.json({ message: "Register the user" });
});

//@desc  login user
//@route GET /api/users/register
//@access public 

const loginUser= asyncHandler(async (req, res) => {
 const {email,password} = req.body;
 if(!email || !password) {
    res.status(400)
    throw new Error ("Please enter all fields");
 }

 const user = await User.findOne({email});
 if(user && (await bcrypt.compare(password,user.password))){

    const accessToken =  jwt.sign(
        {
            user:{
                username: user.username,
                email : user.email,
                password: user.password,
            },
        },
        process.env.ACCESS_TOKEN_SECERT,
        { expiresIn: "15m" }
    );

    res.status(200).json({accessToken});  
 }else{
    res.status(401);
    throw new Error("email or password is not valid");
  }
   
});  

//@desc  current user
//@route GET /api/users/register
//@access public 

const currentUser = asyncHandler(async (req, res) => {
    res.json(req.user);
});

module.exports = {registerUser,loginUser,currentUser};