import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Box } from '@mui/material';
import { coursesData } from "./CourseData";


class Catalog extends Component {
    constructor(props) {
        super(props);

        this.state = {
            classChosen: "",
        }

    this.handleClass = this.handleClass.bind(this)
    }

    handleClass = (event) => {
        this.setState({classChosen: event.target.value}, () => {
            console.log(this.state.classChosen)
        })
    }

    render() {
        // const courses = [
        //     {
        //       name: "AP Physics 1",
        //       code: "APPhysics1",
        //       id: "101",
        //     },
        //     {
        //       name: "AP Chemistry",
        //       code: "APChemistry",
        //       id: "102",
        //     },
        //     //...
        //   ];
      
          return (
            <div course="app">
              {coursesData.map((course) => (
               <Box key={course.id}>
                  <button value={course.code} key={course.id} onClick={this.handleClass}> 
                      <Link key={course.id} to={course.code} state={{course}}>{course.name}</Link>
                  </ button>
                </Box>
              ))}
            </div>
          );
    }
}

export default Catalog