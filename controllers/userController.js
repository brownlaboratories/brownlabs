const express = require("express");
const userService = require("../services/userService");
const router = express.Router();

router.post("/", async (req, res) => {
  const { userId, username, email } = req.body;

  if (!(userId && username && email)) {
    return res
      .status(400)
      .json({ message: "userId, username, and email are required" });
  }

  try {
    const savedUser = await userService.createUser(userId, username, email);
    res.json(savedUser);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "User already exists" });
    }
    res.status(500).json({ message: error.message });
  }
});

router.get("/username/:username", async (req, res) => {
  const username = req.params.username;

  try {
    const user = await userService.findUserByUsername(username);

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

router.post("/updateCourses", async (req, res) => {
  const { userId, selectedCourses, purpose } = req.body;

  try {
    const updatedUser = await userService.updateUserCourses(userId, selectedCourses, purpose);

    if (updatedUser) {
      res.json({ message: "User updated successfully." });
    } else {
      res.status(404).json({ message: "User not found." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:userId', async (req, res) => {
    const { userId } = req.params;
  
    try {
      const deletedUser = await userService.deleteUserById(userId);
  
      if (!deletedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
  router.get('/:userId', async (req, res) => {
    const userId = req.params.userId;
  
    try {
      const user = await userService.findUserByIdWithCourses(userId);
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  router.post('/findUserByEmail', async (req, res) => {
    const { username } = req.body;
  
    try {
      const email = await userService.findUserEmailByUsername(username);
  
      if (email) {
        res.json(email);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  

module.exports = router;
