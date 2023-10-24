const Course = require("../models/Course");

const generateUniqueCourseId = async () => {
  let id = Math.floor(Math.random() * 100000000);
  let course = await Course.findOne({ courseId: id });
  while (course) {
    id = Math.floor(Math.random() * 100000000);
    course = await Course.findOne({ courseId: id });
  }
  return id;
};

const createCourse = async (code, name, description, units, summary, type) => {
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
  return await newCourse.save();
};

const getAllCourses = async () => {
  return await Course.find({});
};

const getCourseByName = async (courseName) => {
  return await Course.findOne({ courseName });
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourseByName,
};
