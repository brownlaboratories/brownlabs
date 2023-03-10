import logo from "./logo.svg";
import "./App.css";
import React from "react";

import Box from "@mui/material/Box";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Landing from "./components/Landing";
import Catalog from "./components/Catalog";
import Login from "./components/Login";
import Dashboard from "./components/Student/Dashboard";
import CourseHomepage from "./components/CourseHP";
import Navigation from "./components/Navbar";
import Plan from "./components/Plan";
import Study from "./components/Study";
import Test from "./components/Test";

function App() {
  return (
    <Router>
      <Navigation />
      <Box sx={{ display: "flex" }}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/courses">
            <Route index={true} element={<Catalog />} />
            <Route path="/courses/:coursename" element={<CourseHomepage />} />
          </Route>
          <Route path="/plan" element={<Plan />} />
          <Route path="/study" element={<Study />} />
          <Route path="/test" element={<Test />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Box>
    </Router>
  );
}

export default App;
