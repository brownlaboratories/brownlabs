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


class Plan extends Component {
  render() {
    return (
      <div>
        <h1>Plan {this.props.course.course.name} </h1>
      </div>
    );
  }
}

export default addProps(Plan)