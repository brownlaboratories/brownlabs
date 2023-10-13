import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
const openaiKey = process.env.REACT_APP_OPENAI_KEY;

const STEMProblemGeneration = ({
    course,
    unit,
    difficulty,
    metadata,
    goal,
  }) => {
    return new Promise((resolve, reject) => {
      let existingProblems = [];
      let newProblems = [];
  
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      };
  
      const buildQueryString = (params) => {
          return Object.keys(params)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
            .join('&');
        };
        
        const params = {
          course: course,
          unit: unit,
          difficulty: difficulty,
          type: metadata.type
        };
        
        const queryString = buildQueryString(params);
  
      fetch(`/api/STEMProblems?${queryString}`, options)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw response;
        }
      })
      .then((jsonResponse) => {
        existingProblems = jsonResponse;
        if(existingProblems.length >= goal) {
          resolve(existingProblems);
        } else {
          return fetch('/api/generateSTEMProblems', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ course, unit, difficulty, goal, format: metadata.type }),
          });
        }
      })
      .then((response) => response ? response.json() : [])
      .then((problems) => {
        resolve([...existingProblems, ...problems]);
      })
      .catch((error) => {
        console.log(error);
      });
    });
  };
  
  

export default STEMProblemGeneration;
