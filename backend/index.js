require("dotenv").config();
const mongoose = require("mongoose");

//middlewares
const bcrypt = require("bcrypt");
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

//multer
const upload = require("./middlewares/multer.middleware");
const fs = require("fs");// Node.js File System module to handle file operations
const path = require("path");// Path module to handle file paths

//custom middlewares
const { authenticateToken } = require("./middlewares/auth.middleware");

//database
const User = require("./models/user.model");
const TravelStory = require("./models/travelStory.model");
const travelStoryModel = require("./models/travelStory.model");
const { error } = require("console");

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected successfully!"))
  .catch(err => console.error("MongoDB connection error:", err));

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // Using environment variable
    credentials: true,
  })
);

//backend url form env and vercel
const backendUrl = process.env.BACKEND_URL || "https://travel-story-app-six.vercel.app";

app.get("/", (req, res) => {
  res.send("Backend is running successfully!");
});

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

//route to handle image uplaod
app.post("/image-upload", upload.single("image"), async (req, res) => {
  //.single("image") → This tells Multer to handle only one file at a time, where "image" is the field name in the form-data request.
  try {
    if (!req.file) {
      return res.status(400).json({ error: true, message: "No file uploaded" });
    }
    const imageUrl = `https://travel-story-app-six.vercel.app/uploads/${req.file.filename}`;

    res.status(200).json({ imageUrl });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
  
});

//delete an image from uplaods folder
app.delete("/delete-image", async (req, res) => {
  // Extract imageUrl from query parameters
  const { imageUrl } = req.query;

  // Check if the imageUrl parameter is provided
  if (!imageUrl) {
    return res.status(400).json({ error: true, message: "imageUrl parameter is required" });
  }

  try {
    /** 
     * Step 1: Extract the filename from the imageUrl 
     * - path.basename(imageUrl) extracts only the filename from the full URL or path
     */
    const filename = path.basename(imageUrl);
    // console.log("Extracted Filename:", filename); output -> Extracted Filename: 1742974848724.jpg

    /** 
     * Step 2: Define the file path where the image is stored 
     * - path.join(__dirname, "uploads", filename) constructs the full path to the image file
     */
    const filePath = path.join(__dirname, "uploads", filename);
    //console.log("File Path:", filePath); output : File Path: C:\Users\SAURBH MOYNAK\Desktop\Travel Story App\backend\uploads\1742974848724.jpg

    /** 
     * Step 3: Check if the file exists in the "uploads" folder 
     */
    if (fs.existsSync(filePath)) {
      /** 
       * Step 4: Delete the file using fs.unlinkSync()
       * - This permanently removes the file from the uploads directory
       */
      fs.unlinkSync(filePath);

      // Send a success response if the file is deleted
      return res.json({ success: true, message: "Image deleted successfully" });
    } else {
      // If the file does not exist, return a 404 error response
      return res.status(404).json({ error: true, message: "Image not found" });
    }
  } catch (error) {
    /** 
     * Step 5: Handle errors properly 
     * - If any error occurs (e.g., permission issue, file system error), return a 500 response
     */
    res.status(500).json({ error: true, message: error.message });
  }
});

//serves static files from the uploads and assets directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
//app.use(...) is used to apply middleware in an Express app.
//express.static(directoryPath) :This middleware serves static files (images, PDFs, videos, etc.).It allows users to access files directly via a URL.
//path.join(__dirname, "uploads") : __dirname: The absolute path of the current file,"uploads": A folder inside the project directory.,path.join(__dirname, "uploads"): Creates the full path to the "uploads" folder.

app.use("/assets", express.static(path.join(__dirname, "assets")));

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

//get all stories
app.get("/get-all-stories", authenticateToken, async (req, res) => {
  // Extract userId from the authenticated request
  const { userId } = req.user;

  try {
    const travelStories = await TravelStory.find({ userId: userId }).sort({ isFavourite: -1 });
    //-1 → Descending order (true values first, false values last).

    return res.status(200).json({
      error: false,
      stories: travelStories,
      message: "All travel stories retrieved successfully",
    });

  } catch (error) {
     // Log the error if something goes wrong
    console.error("Error fetching travel stories:", error);
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

//edit travel story
app.put("/edit-story/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, story, visitedLocation, imageUrl, visitedDate } =
    req.body;
  const { userId } = req.user;

  //validate req fileds
  if (!title || !story || !visitedLocation || !visitedDate) {
    return res
      .status(400)
      .json({ error: true, message: "All fields are required" });
  }

  //Convert visitedDate from milliseconds to Date Object
  const parsedVisitedDate = new Date(parseInt(visitedDate));
  //MongoDB's Date type expects a Date object, not raw milliseconds.
  //If you store milliseconds as a Number, it won't be treated as a date in queries.

  try {
    //find the travel story by ID and ensure it belongs to authenticated user
    const travelStory = await TravelStory.findOne({ _id: id, userId: userId });

    if (!travelStory) {
      return res.status(400).json({ error: true, message: "Travel story not found" });
    }

    const placeholderImgUrl = `${backendUrl}/assets/placeholder.jpg`;

    travelStory.title = title;
    travelStory.story = story;
    travelStory.visitedLocation = visitedLocation;
    travelStory.imageUrl = imageUrl || placeholderImgUrl;
    travelStory.visitedDate = parsedVisitedDate;
  
    await travelStory.save();
    res.status(200).json({ travelStory: travelStory, message: "TravelStory Updated Successfully" });

  } catch (error) {
    /** Handle unexpected errors */
    console.error("Error updating travel story:", error);
    res.status(400).json({
      error: true,
      message: "An unexpected error occurred",
      details: error.message,
    });
  }
});

app.delete("/delete-story/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  try {
    const travelStory = await TravelStory.findOne({ _id: id, userId: userId });

    if (!travelStory) {
      return res.status(400).json({ error: true, message: "Travel story not found" });
    }
    const imageUrl = travelStory.imageUrl;
    await travelStory.deleteOne({ _id: id, userId: userId });

    const filename = path.basename(imageUrl);

    //define the path
    const filePath = path.join(__dirname, "uploads", filename);

    //delete the image file from the uploads folder
    if (imageUrl) {
      const filename = path.basename(imageUrl);
      const filePath = path.join(__dirname, "uploads", filename);

      // Check if the file exists and delete it
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log("Image file deleted successfully:", filename);
      } else {
        console.log("Image file not found, skipping deletion.");
      }
    }

    res.status(200).json({error:false, message: "Travel story deleted successfully" });

  } catch (error) {
    res.status(500).json({error:true, message: error.message});
  }
});

//update isFavourite
app.put("/update-is-favourite/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { isFavourite } = req.body;
  const { userId } = req.user;

  try {
    const travelStory = await TravelStory.findOne({ _id: id, userId: userId });

    if (!travelStory) {
      return res.status(404).json({ error: true, message: "Travel story not found" });
    }

    travelStory.isFavourite = isFavourite;

    await travelStory.save();
    res.status(200).json({ error: false,story:travelStory, message: "isFavourite updated successfully" });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
})

app.get("/search", authenticateToken, async (req, res) => {
  const { query } = req.query;
  const { userId } = req.user;

  if (!query) {
    return res.status(404).json({ error: true, message: "Query is required" });
  }

  try {
    const searchResults = await TravelStory.find({
      userId: userId,
      $or: [
        { title: { $regex: query, $options: "i" } },
        { story: { $regex: query, $options: "i" } },
        { visitedLocation: { $regex: query, $options: "i" } },
      ],
    }).sort({ isFavourite: -1 });

    if (!searchResults || searchResults.length === 0) {
      return res.status(404).json({ message: "No stories found" });
    }

    res.status(200).json({ stories: searchResults });
  } catch (error) {
    res.status(500).json({error: "Internal Server Error", details: error.message});
  }
})

//filter stories
app.get("/travel-stories/filter", authenticateToken, async (req, res) => {
  const { startDate,endDate } = req.query;
  const { userId } = req.user;

  try {
    //convert startdate and endDate from miliseconds to date objects

    const start = new Date(parseInt(startDate));
    const end = new Date(parseInt(endDate));

    //find travel story that belong to the authenticated user and fall within the date range
    const filteredStories = await TravelStory.find({
      userId: userId,
      visitedDate: { $gte: start, $lte: end }
    }).sort({ isFavourite: -1 });

    res.status(200).json({ stories: filteredStories });

  } catch (error) {
    res.status(500).json({error: "Internal Server Error", details: error.message});
  }
})



app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});

module.exports = app;
