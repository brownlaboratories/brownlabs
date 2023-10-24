const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  savedCourses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
  purpose: { type: String },

});

const User = mongoose.model('User', userSchema);

module.exports = User;