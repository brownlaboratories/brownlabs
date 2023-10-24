const express = require("express");
require("dotenv").config();
const cors = require("cors");
const path = require("path");

// Import routes and DB config
const routes = require("./routes/index");
require("./config/db");

const app = express();
const port = process.env.PORT || 3001;

// Enable CORS
app.use(cors());

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "client", "build")));

// Use routes
app.use("/api", routes);


// Fallback for serving your client app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

// Start the server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
