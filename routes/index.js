const express = require("express");
const userController = require("../controllers/userController");
const courseController = require("../controllers/courseController");
const stemStudySetController = require("../controllers/stemStudySetController");
const stemProblemController = require("../controllers/stemProblemController");

const router = express.Router();

console.log("in routes/index.js")

router.use("/users", userController);
router.use("/courses", courseController);
router.use("/studySets", stemStudySetController);
router.use("/STEMProblems", stemProblemController);

module.exports = router;
