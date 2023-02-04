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

class CourseHomepage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let course = this.props.course.course;

    let units = course.units;
    let unitlist = units.map((unit) => <li key={unit}>{unit}</li>);

    return (
      <div>
        <h1>
          {" "}
          {course.name}, ID: {course.id}
        </h1>
        <p>{course.description}</p>
        <ul>{unitlist}</ul>
        <Button>
          <Link key={course.id} to={`/plan`} state={{ course }}>
            Create a Study Plan
          </Link>
        </Button>
        <Button>
          <Link key={course.id} to={`/study`} state={{ course }}>
            Practice with Reps
          </Link>
        </Button>
        <Button>
          <Link key={course.id} to={`/test`} state={{ course }}>
            Take Practice Tests
          </Link>
        </Button>
      </div>
    );
  }
}

export default addProps(CourseHomepage);
