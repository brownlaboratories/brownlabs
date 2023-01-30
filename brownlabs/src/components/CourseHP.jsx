import React, { Component } from "react";
import { useLocation, Link } from "react-router-dom";

function addProps(Component) {
  const GetProps = function (props) {
    const location = useLocation();
    const course = location.state;
    console.log(course.course.units);
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
    let unitlist = units.map((unit) => <li>{unit}</li>);

    return (
      <div>
        <h1>
          {" "}
          {course.name}, ID: {course.id}
        </h1>
        <p>{course.description}</p>
        <ul>{unitlist}</ul>
        <button>
          <Link to={"/courses"}>all courses</Link>
        </button>
      </div>
    );
  }
}

export default addProps(CourseHomepage);
