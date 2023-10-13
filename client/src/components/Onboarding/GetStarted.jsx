import React, { useState } from "react";
import {
  Button,
  Typography,
  Container,
  Box,
  ButtonGroup,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext";
import { useContext, useEffect } from "react";



const GetStarted = () => {
  const { currentUser } = useContext(AuthContext);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [purpose, setPurpose] = useState("");
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    fetch('/api/courses')
      .then(response => response.json())
      .then(data => setCourses(data))
      .catch(error => console.error('Error:', error));
  }, []);

  const handleCourseSelection = (courseId) => {
    setSelectedCourses((prev) => {
      if (prev.includes(courseId)) {
        return prev.filter((id) => id !== courseId);
      } else {
        return [...prev, courseId];
      }
    });
  };
  
  
  

  const handlePurpose = (purpose) => {
    setPurpose(purpose);
  };

  const handleSubmit = async () => {
    const userId = currentUser.uid;
  
    try {
      const response = await fetch('/api/users/updateCourses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          selectedCourses: selectedCourses,
          purpose: purpose,
        }),
      });
  
      if (response.ok) {
        const jsonResponse = await response.json();
        console.log(jsonResponse);
      } else {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message);
      }
    } catch (error) {
      console.error('Failed to update user:', error.message);
    }
  
    navigate("/home");
  };
  
  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Get Started
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom>
        Select your courses
      </Typography>
      <Box
        display="flex"
        flexDirection="row"
        flexWrap="wrap"
        justifyContent="space-between"
        mb={4}
      >
        {courses.map((course, index) => {
          const isSelected = selectedCourses.includes(course._id);
          return (
            <Card
              onClick={() => handleCourseSelection(course._id)}
              key={index}
              style={{
                cursor: "pointer",
                backgroundColor: isSelected ? "rgba(27, 168, 232, 0.81)" : "rgba(255, 255, 255, 1)",
                color: isSelected ? "#fff" : "#000",
                width: "45%",
                marginBottom: "16px",
              }}
            >
              <CardActionArea>
                <CardHeader title={course.courseName}     sx={{ pb: 0 }}  // this will remove padding-bottom
/>
                <CardContent sx={{ pt: 1 }}>  
                  <Typography variant="body2" color="text.secondary">
                    {course.courseDescription}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          );
        })}
      </Box>
      <Typography variant="h5" component="h2" gutterBottom>
        Why are you using Brownlabs?
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 2,
        }}
      >
<ButtonGroup variant="outlined" color="primary">
  <Button
    onClick={() => handlePurpose("school")}
    variant={purpose === "school" ? "contained" : "outlined"}
    value="school"
  >
    School
  </Button>
  <Button
    onClick={() => handlePurpose("personal")}
    variant={purpose === "personal" ? "contained" : "outlined"}
    value="personal"
  >
    Personal Practice
  </Button>
  <Button
    onClick={() => handlePurpose("test")}
    variant={
      purpose === "test" ? "contained" : "outlined"
    }
    value="test"
  >
    Preparing for a Test
  </Button>
</ButtonGroup>

      </Box>
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Submit
      </Button>
      <Button color="secondary" onClick={() => navigate("/home")}>
          Finish Setup Later
        </Button>
    </Container>
  );
};

export default GetStarted;
