import React, { useState, useEffect, useContext } from 'react';
import {useNavigate} from "react-router-dom";
import { Box, Grid, IconButton, TextField, Button, ToggleButton, Typography, ToggleButtonGroup} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon, ToysOutlined } from '@mui/icons-material';


const AddCourse = () => {
    const navigate = useNavigate();
    const [type, setType] = useState("STEM");
    const [course, setCourse] = useState({ 
        name: "",
        code: "",
        description: "",
        summary: "",
        units: Array(4).fill().map(() => ({unit: '', weight: ''})),
        type: "STEM",
    });
    const [language, setLanguage] = useState({
        name: "",
        code: "",
        description: "",

    });

        

    const handleCourseDetailChangeSTEM = (event) => {
        setCourse({
            ...course,
            [event.target.name]: event.target.value
        });
    };

    const handleAddUnitSTEM = (event) => {
        setCourse({
            ...course,
            units: [...course.units, {unit: '', weight: ''}]
        });
    };

    const handleRemoveUnitSTEM = (index) => {
        setCourse({
            ...course,
            units: course.units.filter((unit, i) => i !== index)
        });
    };

    const handleInputChangeSTEM = (e, index) => {
        const { name, value } = e.target;
        const list = [...course.units];
        list[index][name] = value;
        setCourse({ ...course, units: list });
      };        

    const handleCourseDetailChangeLanguage = (event) => {
    };


    const handleSubmit = (event) => {
        event.preventDefault();
        if(type == "STEM") {
        try {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(course)
            };
            fetch('/api/admin/addCourse', requestOptions)
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                });
            alert("Course added successfully!");
                setCourse({
    
                    name: "",
                    code: "",
                    description: "",
                    summary: "",
                    units: Array(4).fill().map(() => ({unit: '', weight: ''})),
                    type: "",

                });
        }
        catch (error) {
            console.log(error);
        }
      }
      

        
    };



    return (
      <div>
          <Box mb={2}>
              <Typography
                variant="h6"
                component="h2"
                gutterBottom
              >
                Course Type
              </Typography>

            <ToggleButtonGroup
              value={type}
              exclusive
              onChange={(e, newType) => {
                console.log(newType);
                setType(newType);
              }}
              aria-label="Type"
              sx={{ height: "60px" }} // Set a fixed height
              color='primary'
            >
              <ToggleButton value="STEM">
                STEM
              </ToggleButton>
              <ToggleButton value="Language">
                Language
              </ToggleButton>

            </ToggleButtonGroup>
          </Box>
        {
          type == "STEM" ? (
            <form onSubmit={handleSubmit}>
            <Box mb={2}>
              <TextField
                fullWidth
                name="code"
                label="Course Code"
                value={course.code}
                onChange={handleCourseDetailChangeSTEM}
                required
              />
            </Box>
            <Box mb={2}>
              <TextField
                fullWidth
                name="name"
                label="Course Name"
                value={course.name}
                onChange={handleCourseDetailChangeSTEM}
                required
              />
            </Box>
            {course.units.map((x, i) => {
              return (
                <Box mb={2} key={i}>
                  <Grid container spacing={2}>
                    <Grid item xs={5}>
                      <TextField
                        name="unit"
                        label="Unit"
                        value={x.unit}
                        onChange={(e) => handleInputChangeSTEM(e, i)}
                        required
                      />
                    </Grid>
                    <Grid item xs={5}>
                      <TextField
                        name="weight"
                        label="Weight / Percentage"
                        value={x.weight}
                        onChange={(e) => handleInputChangeSTEM(e, i)}
                        required
                      />
                    </Grid>
                    <Grid item xs={2}>
                      {course.units.length !== 1 && (
                        <IconButton onClick={() => handleRemoveUnitSTEM(i)}>
                          <RemoveIcon />
                        </IconButton>
                      )}
                    </Grid>
                  </Grid>
                </Box>
              );
            })}
            <Button variant="text" color="primary" onClick={handleAddUnitSTEM} startIcon={<AddIcon />}>
              Add More
            </Button>
            <Box mb={2}>
              <TextField
                fullWidth
                name="description"
                label="Course Description"
                value={course.description}
                onChange={handleCourseDetailChangeSTEM}
                required
              />
            </Box>
              <Box mb={2}>
              <TextField
                  fullWidth
                  name="summary"
                  label="Course Summary"
                  value={course.summary}
                  onChange={handleCourseDetailChangeSTEM}
              />
              </Box>
  
            <Button variant="contained" color="primary" type="submit">
              Add Course
            </Button>
          </form>
          ) : (
            <></>
          )
        }

        </div>
      );
    }
  
export default AddCourse;