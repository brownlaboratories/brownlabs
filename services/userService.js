const User = require("../models/User");

const createUser = async (userId, username, email) => {
  const newUser = new User({ userId, username, email });
  return await newUser.save();
};

const findUserByUsername = async (username) => {
  return await User.findOne({ username });
};

const updateUserCourses = async (userId, selectedCourses, purpose) => {
  const user = await User.findOne({ userId });
  user.savedCourses = selectedCourses;
  user.purpose = purpose;
  return await user.save();
};

const deleteUserById = async (userId) => {
  return await User.findOneAndDelete({ userId });
};

const findUserByIdWithCourses = async (userId) => {
  return await User.findOne({ userId }).populate("savedCourses");
};

const findUserEmailByUsername = async (username) => {
  const user = await User.findOne({ username });
  return user ? user.email : null;
};

module.exports = {
  createUser,
  findUserByUsername,
  updateUserCourses,
  deleteUserById,
  findUserByIdWithCourses,
  findUserEmailByUsername,
};
