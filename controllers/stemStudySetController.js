const express = require("express");
const stemStudySetService = require("../services/stemStudySetService");
const router = express.Router();

router.post("/", async (req, res) => {
  const { variety, course, unit, difficulty, type, goal } = req.body;

  try {
    const newStudySet = await stemStudySetService.createStudySet(
      variety,
      course,
      unit,
      difficulty,
      type,
      goal
    );
    res.status(200).json({ uid: newStudySet.uid });
  } catch (error) {
    res.status(500).json({ error: "Error creating study set" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const studySet = await stemStudySetService.findStudySetById(id);
    if (!studySet) {
      return res.status(404).json({ error: "Study set not found" });
    }
    res.status(200).json(studySet);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving study set" });
  }
});

module.exports = router;
