import React, { useEffect, useState } from "react";
import {
  Button,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
} from "@mui/material";
import STEMGeneration from "../../Generation/STEM/STEMSetGenerationFromDialog";

const QuestionComponent = ({ questions, goal, courseName, type, setId }) => {
    const [currentProblemIndex, setCurrentProblemIndex] = useState(0);

  // console.log("Questions:", questions, "Goal:", goal, "Course Name:", courseName, "Type:", type, "CPI:", currentProblemIndex);
  const [userAnswer, setUserAnswer] = useState("");
  const [revealAnswer, setRevealAnswer] = useState(false);

  const checkAnswer = () => {
    const selectedAnswerIndex = questions[currentProblemIndex].options.indexOf(userAnswer);
    const selectedAnswerLetter = String.fromCharCode(65 + selectedAnswerIndex);
    const correctAnswer = questions[currentProblemIndex].answer;
  
    console.log("Selected Answer:", selectedAnswerLetter); // Debugging
    console.log("Correct Answer:", correctAnswer); // Debugging
  
    if (selectedAnswerLetter === correctAnswer) {
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
    alert(
      `Correct answer: ${questions[currentProblemIndex].answer}`
    );
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
        maxHeight: '75vh', // Set a specific height
        width: '80%', // Set a specific width
        margin: '5vh auto', // Center the box
        overflowY: 'auto', // Enable scrolling if content exceeds the height
        borderRadius: '8px', // Optional: add rounded corners
        border: '1px solid #ccc', // Optional: add a border
      }}
    >
      {/* <Typography variant="h3" component="h1" color="primary">
        Quiz Time!
      </Typography> */}
      {currentProblemIndex < goal ? (
        <>
          <Typography variant="h5" component="h2">
            {currentProblemIndex + 1}) {questions[currentProblemIndex].question}
          </Typography>
          <RadioGroup value={userAnswer} onChange={handleInputChange}>
            {questions[currentProblemIndex].options.map((option, index) => (
              <FormControlLabel
                key={index}
                value={option}
                control={<Radio />}
                label={`${String.fromCharCode(65 + index)}. ${option}`}
              />
            ))}
          </RadioGroup>
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

export default QuestionComponent;
