const STEMProblem = require("../models/STEMProblem");

const getProblemsByCriteria = async (course, unit, difficulty, type) => {
  return await STEMProblem.find({
    "metadata.course": course,
    "metadata.unit": unit,
    "metadata.difficulty": difficulty,
    "metadata.format": type,
  });
};

const createNewProblems = async (course, unit, difficulty, goal, format) => {
    let systemMessage;
    if (format === "Multiple Choice") {
      systemMessage = `You are a specialized AI for generating educational test questions, specifically multiple-choice questions that encompass both conceptual understanding and mathematical calculations. For every conceptual question, have a ratio of two mathematical questions. Your task is to create questions that align with a specified Course, Unit, Difficulty, and Number of Questions. The questions may require the application of formulas, problem-solving techniques, or theoretical principles. Make sure the questions are formatted in the same way as problems of the course are supposed to be. Each question object should contain:
      - "question": The text of the question.
      - "options": An array of answer choices without letters in front.
      - "correct_answer": The letter corresponding to the correct answer option (e.g., 'A', 'B', 'C', 'D').
    The questions could either be in simple question/answer format, or can be fill-in-the-blank questions with the options as values that would fill in the blank. They may also include mathematical expressions, diagrams, or graphs as needed. Return a formatted JSON array of question objects.
    Accuracy is paramount. Please ensure that each question is crafted with precision and that the correct answer is indeed correct, whether it's a conceptual question or a calculative problem.
    `;
    } else if (format === "Manual Input") {
      systemMessage = `You are a specialized AI for generating educational test questions, specifically questions that require type-in responses, encompassing both conceptual understanding and mathematical calculations. Prioritize mathematical questions. Your task is to create questions that align with a specified Course, Unit, Difficulty, and Number of Questions. The questions may require the application of formulas, problem-solving techniques, or theoretical principles. Make sure the questions are formatted in the same way as problems of the course are supposed to be, and include any relevant units directly within the text of the question itself. Each question object should contain:
      - "question": The text of the question, including any relevant units.
      - "options": An array of correct answers that represent different variations of the correct response. For example, ["5 seconds", "5s", "5"] if the answer pertains to a time duration. Have at least 6 or 7 variations of the correct answer, with and without units.
      - "answer": randomly pick one of the options - not really that important. 
    The questions could either be in simple question/answer format, or can be fill-in-the-blank questions with the answer as the value that would fill in the blank. They may also include mathematical expressions, diagrams, or graphs as needed. Return a formatted JSON array of question objects, with the possibility of multiple variations of the correct answer included in the "correctOptions" array.
    Accuracy is paramount. Please ensure that each question is crafted with precision and that the correct answer variations are indeed correct, whether it's a conceptual question or a calculative problem.
    
    `;
    }
  
    const userMessage = `Course: ${course}\nUnit: ${unit}\nDifficulty: ${difficulty}\nNumber of Questions: ${goal}`;
  
    const questions = await openAiService.generateSTEMProblems(systemMessage, userMessage);
  
    let newProblems;
    if (format === "Multiple Choice") {
      newProblems = questions.map((object) => ({
        question: object.question,
        options: object.options,
        answer: object.correct_answer,
        metadata: {
          format: format,
          difficulty: difficulty,
          course: course,
          unit: unit,
        },
      }));
    } else if (format === "Manual Input") {
      newProblems = questions.map((object) => ({
        question: object.question,
        answer: object.answer,
        options: object.options,
        metadata: {
          format: format,
          difficulty: difficulty,
          course: course,
          unit: unit,
        },
      }));
    }
  
    return await STEMProblem.insertMany(newProblems);
  };

  
module.exports = {
  getProblemsByCriteria,
};
