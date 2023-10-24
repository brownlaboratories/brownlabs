const STEMStudySet = require("../models/STEMStudySet");

const createStudySet = async (variety, course, unit, difficulty, type, goal) => {
  const uid = Math.floor(Math.random() * 100000000)
    .toString()
    .padStart(8, "0");
  const newStudySet = new STEMStudySet({
    variety,
    course,
    unit,
    difficulty,
    type,
    goal,
    uid,
  });
  return await newStudySet.save();
};

const findStudySetById = async (uid) => {
  return await STEMStudySet.findOne({ uid });
};

module.exports = {
  createStudySet,
  findStudySetById,
};
