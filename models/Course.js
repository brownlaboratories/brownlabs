const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    courseId: { type: String, required: true, unique: true },
    courseCode: { type: String, required: true, unique: true },
    courseName: { type: String, required: true},
    courseDescription: { type: String, required: true },
    units: [
        {
          unit: {
            type: String,
            required: true,
          },
          weight: {
            type: Number,
            required: true,
          },
        },
      ],
    courseSummary: { type: String },
    courseType: { type: String, required: true }
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;

