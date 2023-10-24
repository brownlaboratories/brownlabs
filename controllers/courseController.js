const express = require("express");
const courseService = require("../services/courseService");
const router = express.Router();

router.post("/admin/addCourse", async (req, res) => {
  const { code, name, description, units, summary, type } = req.body;

  if (!(code && name && description && units && type)) {
    return res.status(400).json({
      message:
        "courseCode, courseName, courseDescription, and units are required",
    });
  }

  try {
    const savedCourse = await courseService.createCourse(
      code,
      name,
      description,
      units,
      summary,
      type
    );
    res.json(savedCourse);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Course already exists" });
    }
    res.status(500).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const courses = await courseService.getAllCourses();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:courseName", async (req, res) => {
  const courseName = req.params.courseName;
  try {
    const course = await courseService.getCourseByName(courseName);
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
