import React, { useState, useEffect } from "react";
import {
  Button,
  Typography,
  TextField,
  Box,
} from "@mui/material";
import STEMGeneration from "../../Generation/STEM/STEMSetGenerationFromDialog";

const ManualInputQuestionComponent = ({ questions, goal, courseName, type, setId }) => {
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [revealAnswer, setRevealAnswer] = useState(false);

  //console.log("Current Problem Index:", currentProblemIndex, );
  const checkAnswer = () => {
    const correctOptions = questions[currentProblemIndex].options;

    console.log("User Answer:", userAnswer); // Debugging
    console.log("Correct Options:", correctOptions); // Debugging

    if (correctOptions.includes(userAnswer)) {
      setCurrentProblemIndex(currentProblemIndex + 1);
      setUserAnswer("");
    } else {
      alert("Incorrect answer. Please try again.");
    }
  };

  const handleInputChange = (event) => {
    setUserAnswer(event.target.value);
  };

  const revealCorrectAnswer = () => {
    alert(`Correct answers: ${questions[currentProblemIndex].options.join(', ')}`);
  };

  useEffect(() => {
    setCurrentProblemIndex(0);
    setUserAnswer("");
    setRevealAnswer(false);
  }, [setId]);

  const skip = () => {
    setCurrentProblemIndex(currentProblemIndex + 1);
    setUserAnswer("");
    setRevealAnswer(false);
  };

  return (
    <Box
    sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 2,
        bgcolor: '#f5f5f5',
        padding: 4,
        maxHeight: '75vh',
        width: '80%',
        margin: '5vh auto',
        overflowY: 'auto',
        borderRadius: '8px',
        border: '1px solid #ccc',
      }}
    >
      {currentProblemIndex < goal ? (
        <>
          <Typography variant="h5" component="h2">
            {currentProblemIndex + 1}) {questions[currentProblemIndex].question}
          </Typography>
          <TextField 
            label="Your Answer"
            variant="outlined"
            value={userAnswer}
            onChange={handleInputChange}
          />
          <Button variant="contained" color="primary" onClick={checkAnswer}>
            Submit
          </Button>
          <Button variant="text" color="error" onClick={revealCorrectAnswer}>
            Reveal Answer
          </Button>
          <Button variant="outlined" color="secondary" onClick={skip}>
            Skip/Move On
          </Button>
        </>
      ) : (
        <>
        <Typography variant="h6" component="h2" color="success">
          Congratulations! You've solved all the questions. 
        </Typography>
        <STEMGeneration course={{courseName: courseName, units: []}}/>
        </>
      )}
    </Box>
  );
};

export default ManualInputQuestionComponent;
