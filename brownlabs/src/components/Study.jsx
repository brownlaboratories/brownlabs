import React, { Component } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@mui/material";

function addProps(Component) {
  const GetProps = function (props) {
    const location = useLocation();
    const course = location.state;
    return <Component {...props} course={course} />;
  };
  return GetProps;
}


class Study extends Component {
  render() {
    return (
      <div>
        <h1>Study {this.props.course.course.name} </h1>
      </div>
    );
  }
}

export default addProps(Study)