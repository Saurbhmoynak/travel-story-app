require("dotenv").config();
const config = require("./config.json");
const mongoose = require("mongoose");

//middlewares
const bcrypt = require("bcrypt");
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

//custom middlewares
const { authenticateToken } = require("./middlewares/auth.middleware");

//database
const User = require("./models/user.model");
const TravelStory = require("./models/travelStory.model");
mongoose.connect(config.connectionString);

const app = express();
app.use(express.json());
app.use(cors({ origin: "a" }));

//create account
app.post("/create-account", async (req, res) => {
  // Extract fullName, email, and password from request body
  const { fullName, email, password } = req.body;

  // Check if all required fields are provided
  if (!fullName || !email || !password) {
    return res
      .status(400)
      .json({ error: true, message: "All fields are required" });
  }

  // Check if a user with the same email already exists in the database
  const isUser = await User.findOne({ email });
  if (isUser) {
    return res.status(400).json({ error: true, message: "User already exist" });
  }

  // Hash the user's password before storing it
  const hashPassword = await bcrypt.hash(password, 10);

  // Create a new user object with hashed password
  const user = new User({
    fullName,
    email,
    password: hashPassword,
  });

  // Save the new user to the database
  await user.save();

  // Generate an access token for authentication (valid for 72 hours)
  const accessToken = jwt.sign(
    { userId: user._id }, // Payload containing user ID
    process.env.ACCESS_TOKEN_SECRET, // Secret key for signing the token
    {
      expiresIn: "72h", // Token expiration time
    }
  );

  // Send response with user details and access token
  return res.status(201).json({
    error: false,
    user: { fullName: user.fullName, email: user.email },
    accessToken,
    message: "Registration Successful",
  });
});

//login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and Password are required" });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid Credentials" });
  }

  const accessToken = jwt.sign(
    { userId: user._id },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "72h",
    }
  );

  return res.status(200).json({
    error: false,
    message: "Login successful",
    user: { fullName: user.fullName, email: user.email },
    accessToken,
  });
});

//get user
app.get("/get-user", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user; //Extract userId from decoded token
    //console.log("Decoded Token:", req.user);

    const isUser = await User.findOne({ _id: userId }); //Find user in DB

    //console.log("User found:", isUser);

    if (!isUser) {
      return res.status(404).json({ message: "User not found" }); // If user not found, return Unauthorized
    }

    return res.status(200).json({
      user: isUser,
      message: "User retrieved successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

//add travel story
app.post("/add-travel-story", authenticateToken, async (req, res) => {
  const { title, story, visitedLocation, isFavourite, imageUrl, visitedDate } =
    req.body;
  const { userId } = req.user;

  //validate req fileds
  if (!title || !story || !visitedLocation || !imageUrl || !visitedDate) {
    return res
      .status(400)
      .json({ error: true, message: "All fields are required" });
  }

  //Convert visitedDate from milliseconds to Date Object
  const parsedVisitedDate = new Date(parseInt(visitedDate));
  //MongoDB's Date type expects a Date object, not raw milliseconds.
  //If you store milliseconds as a Number, it won't be treated as a date in queries.

  try {
    const newStory = new TravelStory({
      userId,
      title,
      story,
      visitedLocation,
      isFavourite: isFavourite || false, // Default false if not provided
      imageUrl,
      visitedDate: parsedVisitedDate, // Store converted Date object
    });

    // Save the story to the database
    await newStory.save();

    return res.status(201).json({
      error: false,
      travelStory:newStory,
      message: "Travel Story added successfully",
    });
  } catch (error) {
    console.error("Error adding tavel story", error);
    return res.status(400).json({
      error: true,
      message: error.message,
    });
  }
});



app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});

module.exports = app;
