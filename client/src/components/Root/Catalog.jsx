import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardActionArea, Typography, Box } from '@mui/material';
import { Grid } from '@mui/material';

const Catalog = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('/api/courses');
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div>
      <h1>Course Catalog</h1>
      <Box
        display="flex"
        flexDirection="row"
        flexWrap="wrap"
        justifyContent="space-between"
        mb={4}
      >
        {courses.map((course, index) => (
          <Card
            key={index}
            style={{
              cursor: "pointer",
              width: "45%",
              marginBottom: "16px",
            }}
          >
            <CardActionArea>
              <CardContent sx={{ pb: 0 }}>
                <Typography variant="h5" component="div">
                  {course.courseCode} - {course.courseName}
                </Typography>
              </CardContent>
              <CardContent sx={{ pt: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {course.courseDescription}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </div>
  );
}

export default Catalog;
