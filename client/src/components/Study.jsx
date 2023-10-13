import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import QuestionComponent from "./Practice/STEM/STEMSetReps";
import { CircularProgress } from "@mui/material";
import { AuthContext } from "../AuthContext";
import { PleaseLogin } from "./Root/Login";
import STEMProblemGeneration from "./Generation/STEM/STEMProblemGeneration";
import ManualInputQuestionComponent from "./Practice/STEM/STEMSetFRQ";

const apikey = process.env.REACT_APP_OPENAI_KEY;



const Study = () => {

  const navigate = useNavigate();
  const params = useParams();
  const id = params.id;

  const [questions, setQuestions] = useState([]);

  const { currentUser } = useContext(AuthContext);




  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [problem, setProblem] = useState("");

  const [studySet, setStudySet] = useState({});

  const [goal, setGoal] = useState(0);

  const shuffleArray = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap elements
    }
    return arr;
  };

  useEffect(() => {
    setQuestions([]);
    const fetchStudySet = async () => {
      try {
        const response = await fetch(`/api/sets/${id}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setStudySet(data);
        //console.log(data);
        const problemProps = {
            course: data.course,
            unit: data.unit,
            difficulty: data.difficulty,
            metadata: {
                type: data.type,
            },
            goal: data.goal,
        }
        setGoal(data.goal);
        //console.log(studySet.type)
        STEMProblemGeneration(problemProps)
        .then((problems) => {
            problems = shuffleArray(problems);
            setQuestions(problems);
            //console.log(questions)
        })
        .catch((error) => {
            //console.log(error);
        });
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchStudySet();
  }, [id]);

  if(!currentUser) {
    return <PleaseLogin sourceTitle={"Study Set page"} sourceUrl={`/study/${params.id}`}/>
    };

  //console.log(studySet);
  //console.log("Questions:", questions);

  return (
    <div>
      {studySet && (
        <div style={{ textAlign: "center" }}>
          <h1>{studySet.unit} : {studySet.goal}</h1>
        </div>
      )}
      {questions.length>0 ? (
        <div>
          {studySet && studySet.type === "Multiple Choice" ? (
            <QuestionComponent questions={questions} goal={goal} courseName={studySet.course} type={studySet.type} setId={id}/>
          ) : (
            studySet.type === "Manual Input" ? (
              <ManualInputQuestionComponent questions={questions} goal={goal} courseName={studySet.course} type={studySet.type} setId={id}/>
            ) : (
              <div>Error: Unsupported question type</div>
            )
          )}
                  </div>
      ) : (
        <CircularProgress />
      )}
    </div>
  );
};

export default Study;
