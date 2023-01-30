import logo from './logo.svg';
import './App.css';
import React from 'react';

import Box from '@mui/material/Box'

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';

import Landing from './components/Landing';
import Catalog from './components/Catalog';
import Login from './components/Login';
import Dashboard from './components/Student/Dashboard';
import APPhysics1 from './components/Courses/APPhysics1';
import CourseHomepage from './components/CourseHP'
import Navigation from './components/Navbar';


function App() {
  return (
    <Router>
      <Navigation/>
      <Box sx={{display:'flex'}}>
        <Routes>
          <Route path="/" element={<Landing/>}/>
          <Route path="/courses">
              <Route index={true} element={<Catalog/>}/>
              <Route path="/courses/:coursename" element={<CourseHomepage/>}/>
          </Route>
          <Route path="/login" element={<Login/>}/>
        </Routes>
      </Box>  
    </Router>
  );
}

export default App;
