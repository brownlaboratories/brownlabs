import React, { useEffect, useState } from "react";
import {
  Button,
  DialogContent,
  TextField,
  MenuItem,
  Box,
  Slider,
  ToggleButtonGroup,
  ToggleButton,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const STEMGeneration = ({ course = { courseName: "", units: [] } }) => {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [type, setType] = useState("");
  const [goal, setGoal] = useState(5); // Default value for the slider


  const navigate = useNavigate();

  const [topics, setTopics] = useState(course.units || []);
  const difficulties = ["Easy", "Medium", "Hard"];
  const types = ["Multiple Choice", "Manual Input"];

  useEffect(() => {
    if(course.units.length == 0 ) {
      fetch(`/api/courses/${encodeURIComponent(course.courseName)}`)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setTopics(data.units); // Update the state
        });
    }
  }, []);


  const handleSubmit = async () => {
    let courseName = course.courseName;
    let variety = "STEM";
    console.log("Form submitted with:", {
      variety,
      courseName,
      topic,
      difficulty,
      type,
      goal,
    });

    const studySetData = {
      variety: variety,
      course: courseName,
      unit: topic,
      difficulty: difficulty,
      type: type,
      goal: goal,
    };

    const response = await fetch("/api/studySet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(studySetData),
    });

    if (!response.ok) {
      throw new Error("Response is not OK");
    }

    const data = await response.json();
    const studySetUID = data.uid;
    setTopic("");
    setDifficulty("");
    setType("");
    setGoal(5);
    
    navigate(`/study/${studySetUID}`);
  };

  const isSubmitDisabled = () => {
    return !topic || !difficulty || !type || !goal;
  };

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            paddingTop: "10px",
          }}
        >
          <TextField
            select
            label="Topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            sx={{
              width: "40%",
              height: "100%",
              overflow: "hidden", // Added padding to the top
            }} // Set a fixed width
            variant="outlined"
          >
            {topics.map((topic, index) => (
              <MenuItem key={index} value={topic.unit}>
                {topic.unit}
              </MenuItem>
            ))}
          </TextField>
          <ToggleButtonGroup
            value={difficulty}
            exclusive
            onChange={(e, newDifficulty) => setDifficulty(newDifficulty)}
            aria-label="Difficulty"
            sx={{ height: "60px" }} // Set a fixed height
          >
            {difficulties.map((diff, index) => (
              <ToggleButton key={index} value={diff}>
                {diff}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
          <ToggleButtonGroup
            value={type}
            exclusive
            onChange={(e, newType) => setType(newType)}
            aria-label="Type"
            sx={{ height: "60px" }} // Set a fixed height
          >
            {types.map((typeOption, index) => (
              <ToggleButton key={index} value={typeOption}>
                {typeOption}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>
        <Box sx={{ marginTop: 2 }}>
          <Typography gutterBottom>Goal</Typography>
          <Slider
            value={goal}
            onChange={(e, newValue) => setGoal(newValue)}
            valueLabelDisplay="auto"
            step={5}
            marks
            min={5}
            max={40}
          />
        </Box>
        <Box sx={{ marginTop: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={isSubmitDisabled()}
            fullWidth
          >
            Submit
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default STEMGeneration;
