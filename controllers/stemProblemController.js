const express = require("express");
const stemProblemService = require("../services/stemProblemService");
const router = express.Router();

router.get("/", async (req, res) => {
  const course = req.query.course;
  const unit = req.query.unit;
  const difficulty = req.query.difficulty;
  const type = req.query.type;

  try {
    const problems = await stemProblemService.getProblemsByCriteria(
      course,
      unit,
      difficulty,
      type
    );
    res.json(problems);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

router.post("/generateSTEMProblems", async (req, res) => {
    const { course, unit, difficulty, goal, format } = req.body;
  
    try {
      const problems = await stemProblemService.createNewProblems(
        course,
        unit,
        difficulty,
        goal,
        format
      );
      res.json(problems);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  });
  

module.exports = router;
