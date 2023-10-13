import React, { useContext } from "react";
import { AuthContext } from "../../AuthContext";
import { getAuth, signOut } from "firebase/auth";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import STEMGeneration from "../Generation/STEM/STEMSetGenerationFromDialog";
import { Info as InfoIcon } from "@mui/icons-material";
import { Tabs, Tab } from "@mui/material";

import {
  Typography,
  Grid,
  Accordion,
  Box,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";

const Dashboard = () => {
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const [userCourses, setUserCourses] = useState([]);

  const [selectedCourse, setSelectedCourse] = useState(null);

  const navigate = useNavigate();

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await fetch(`/api/users/${currentUser.uid}`);
      const data = await response.json();
      setUserCourses(data.savedCourses);
    };
    fetchUserData();
  }, [currentUser]);

  const openPopout = (course, index) => {
    setSelectedCourse(course);
    setValue(index);
  };


  const handleClosePopout = () => {
    setSelectedCourse(null);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        width: "100%",
        height: "100%",
        paddingTop: 6,
        paddingX: 2,
      }}
    >
      <Grid container spacing={2}>
        {userCourses.map((course) => (
          <Grid item xs={12} md={4} key={course._id}>
            <Box
              sx={{
                backgroundColor: "#f9f9f9",
                borderRadius: 1,
                padding: 2,
                marginBottom: 2,
              }}
            >
              <Grid container alignItems="center" spacing={2}>
                <Grid item xs>
                  <Typography variant="h5">{course.courseName}</Typography>
                </Grid>
                <Grid item>
                  <IconButton
                    onClick={() => openPopout(course, 0)}
                    aria-label="More information about this course"
                  >
                    <InfoIcon sx={{ color: "black" }} />
                  </IconButton>
                </Grid>
              </Grid>
              <Grid container spacing={1} sx={{ marginTop: 1 }}>
                {/* <Grid item xs={12} md={4}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate(`/course/${course._id}`)}
                    sx={{
                      width: "100%",
                      height: "50px",
                      border: "2px solid",
                      borderColor: "black", // Change as needed
                      color: "black", // Change as needed
                      backgroundColor: "#f9f9f9", // Change as needed
                    }}
                  >
                    Course Homepage
                  </Button>
                </Grid> */}
                <Grid item xs={12} md={6}>
                  <Button
                    variant="outlined"
                    onClick={() => openPopout(course, 1)}
                    sx={{
                      width: "100%",
                      height: "50px",
                      border: "2px solid",
                      borderColor: "black", // Change as needed
                      color: "black", // Change as needed
                      backgroundColor: "#f9f9f9", // Change as needed
                    }}
                  >
                    Practice Problems
                  </Button>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Button
                    variant="outlined"
                    onClick={() => openPopout(course, 2)}
                    sx={{
                      width: "100%",
                      height: "50px",
                      border: "2px solid",
                      borderColor: "black", // Change as needed
                      color: "black", // Change as needed
                      backgroundColor: "#f9f9f9", // Change as needed
                    }}
                  >
                    Take a Test
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        ))}
      </Grid>
      {selectedCourse && (
        <Dialog
          open={selectedCourse !== null}
          onClose={handleClosePopout}
          fullWidth
          sx={{
            "& .MuiDialog-paper": {
              backgroundColor: "#f5f5f5",
              padding: "24px",
              borderRadius: "15px",
              border: "2px solid #000", // Add a border
            },
          }}
        >
          <DialogTitle sx={{ position: "relative", textAlign: "center" }}>
            {selectedCourse?.courseName}
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleClosePopout}
              aria-label="close"
              sx={{ position: "absolute", right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
                centered
              >
                <Tab label="Course Info" />
                <Tab label="Practice" />
                <Tab label="Test" />
              </Tabs>
            </Box>
            {value === 0 && 
              <DialogContent>
                <Typography variant="h6" component="h2" gutterBottom>
                  Course Description
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedCourse?.courseDescription}
                </Typography>
                <Typography variant="h6" component="h2" gutterBottom>
                  Course Units
                </Typography>
                {selectedCourse?.units.map((unit) => (
                  <Accordion key={unit.unit}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                      sx={{ backgroundColor: "#f5f5f5" }}
                    >
                      <Typography>{unit.unit}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>{unit.weight} Percent</Typography>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </DialogContent>

              }
            {value === 1 && (
              <DialogContent>
                <STEMGeneration course={selectedCourse} />{" "}
              </DialogContent>
            )}
            {value === 2 && <Typography>{/* Test */}</Typography>}
          </DialogContent>
        </Dialog>
      )}
    </Box>
  );
};

export default Dashboard;
