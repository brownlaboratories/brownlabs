const express = require("express");
const mongoose = require("mongoose");
const OpenAi = require("openai");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("./models/User");
const Course = require("./models/Course");
const STEMStudySet = require("./models/STEMStudySet");
const STEMProblem = require("./models/STEMProblem");

const app = express();
const cors = require("cors");

const {generatePrompt} = require("./services/problemPromptService");


const path = require("path")


const mongodburi = process.env.MONGOACCESSKEY;
const jwtkey = process.env.JWTHASHKEY;

const openai = new OpenAi({
  apiKey: process.env.OPENAI_KEY,
})

const OPENAI_API_KEY = process.env.OPENAI_KEY;

// Enable CORS
app.use(cors());
// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "client", "build")))


// Connect to MongoDB
mongoose.connect(mongodburi, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

app.post("/api/users", async (req, res) => {
  const { userId, username, email } = req.body;

  if (!(userId && username && email)) {
    return res
      .status(400)
      .json({ message: "userId, username, and email are required" });
  }

  try {
    const newUser = new User({ userId, username, email });
    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (error) {
    if (error.code === 11000) {
      // MongoDB duplicate key error
      return res.status(400).json({ message: "User already exists" });
    }
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/users/username/:username", async (req, res) => {
  const username = req.params.username;

  try {
    const user = await User.findOne({ username });

    if (user) {
      res.status(200).json({ userExists: true });
    } else {
      res.status(200).json({ userExists: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
});

app.post("/api/users/updateCourses", async (req, res) => {
  const { userId, selectedCourses, purpose } = req.body;

  try {
    const user = await User.findOne({ userId: userId });

    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    user.savedCourses = selectedCourses;
    user.purpose = purpose;

    await user.save();

    res.json({ message: "User updated successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const generateUniqueCourseId = async () => {
  let id = Math.floor(Math.random() * 100000000);
  let course = await Course.findOne({ courseId: id });
  while (course) {
    id = Math.floor(Math.random() * 100000000);
    course = await Course.findOne({ courseId: id });
  }
  return id;
};

app.post("/api/admin/addCourse", async (req, res) => {
  console.log(req.body);
  const { code, name, description, units, summary, type } = req.body;

  if (!(code && name && description && units && type)) {
    return res.status(400).json({
      message:
        "courseId, courseCode, courseName, courseDescription, and units are required",
    });
  }

  try {
    const courseId = await generateUniqueCourseId();
    const newCourse = new Course({
      courseId,
      courseCode: code,
      courseName: name,
      courseDescription: description,
      units,
      courseSummary: summary,
      courseType: type,
    });
    const savedCourse = await newCourse.save();
    res.json(savedCourse);
  } catch (error) {
    if (error.code === 11000) {
      // MongoDB duplicate key error
      return res.status(400).json({ message: "Course already exists" });
    }
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/courses", async (req, res) => {
  try {
    const courses = await Course.find({});
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/courses/:courseName", async (req, res) => {
  const courseName = req.params.courseName;
  try {
    const course = await Course.findOne({ courseName: courseName });
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/users/:userId', async (req, res) => {
  const { userId } = req.params;
  
  try {
    const deletedUser = await User.findOneAndDelete({ userId });
    
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get("/api/users/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await User.findOne({ userId: userId }).populate(
      "savedCourses"
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/findUserByEmail", async (req, res) => {
  const { username } = req.body;
  try {
    const user = await User.findOne({ username: username });
    if (user) {
      res.json(user.email);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/studySet", async (req, res) => {
  const { variety, course, unit, difficulty, type, goal } = req.body;

  // Look for existing study set
  const existingStudySet = await STEMStudySet.findOne({
    variety,
    course,
    unit,
    difficulty,
    type,
    goal,
  });
  if (existingStudySet) {
    return res.status(200).json({ uid: existingStudySet.uid });
  }

  // Generate a unique uid
  let uid;
  while (true) {
    uid = Math.floor(Math.random() * 100000000)
      .toString()
      .padStart(8, "0");
    const uidExists = await STEMStudySet.findOne({ uid });

    if (!uidExists) {
      break;
    }
  }

  // Create a new study set
  const newStudySet = new STEMStudySet({
    variety,
    course,
    unit,
    difficulty,
    type,
    goal,
    uid,
  });
  try {
    await newStudySet.save();
    res.status(200).json({ uid: newStudySet.uid });
  } catch (error) {
    res.status(500).json({ error: "Error creating study set" });
  }
});

app.get("/api/sets/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const studySet = await STEMStudySet.findOne({ uid: id });
    if (!studySet) {
      return res.status(404).json({ error: "Study set not found" });
    }
    res.status(200).json(studySet);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving study set" });
  }
});



app.get("/api/STEMProblems", async (req, res) => {
  const course = req.query.course;
  const unit = req.query.unit;
  const difficulty = req.query.difficulty;
  const type = req.query.type;

  try {
    const problems = await STEMProblem.find({
      "metadata.course": course,
      "metadata.unit": unit,
      "metadata.difficulty": difficulty,
      "metadata.format": type,
    });
    res.json(problems);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/generateSTEMProblems", async (req, res) => {
  const { course, unit, difficulty, goal, format } = req.body;

  const systemMessage = generatePrompt(format);

  console.log()

  const userMessage = `Course: ${course}\nUnit: ${unit}\nDifficulty: ${difficulty}\nNumber of Questions: ${goal}`;

  openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: systemMessage },
      { role: "user", content: userMessage },
    ]
  })
  .then((response) => {
    // Changed from response.data.choices[0].message.content to response.choices[0].message.content
    const validJsonString = response.choices[0].message.content;
    const questions = JSON.parse(validJsonString);
    let newProblems;
  
    if (format === "Multiple Choice") {
      newProblems = questions.map((object) => ({
        question: object.question,
        options: object.options,
        answer: object.correct_answer,
        metadata: {
          format: format,
          difficulty: difficulty,
          course: course,
          unit: unit,
        },
      }));
    } else if (format === "Manual Input") {
      newProblems = questions.map((object) => ({
        question: object.question,
        answer: object.answer,
        options: object.options,
        metadata: {
          format: format,
          difficulty: difficulty,
          course: course,
          unit: unit,
        },
      }));
    }
  
    STEMProblem.insertMany(newProblems)
      .then((problems) => {
        res.json(problems); // Send the inserted problems as a JSON response
      })
      .catch((error) => {
        res.status(500).json({ message: error.message }); // Send an error response if insertion fails
      });
  })
  .catch((error) => {
    if (error instanceof OpenAI.APIError) {
      console.error(error.status);  // e.g. 401
      console.error(error.message); // e.g. The authentication token you passed was invalid...
      console.error(error.code);  // e.g. 'invalid_api_key'
      console.error(error.type);  // e.g. 'invalid_request_error'
      res.status(500).json({ message: error.message });
    } else {
      // Non-API error
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  });
});



// Start server
const port = process.env.PORT || 3001;

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});