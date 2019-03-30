// The component retrieves the list of courses from the REST API,
// renders a list of courses, links each course to its respective
// "Course Detail" screen, and renders a link to the "Create Course" screen.
import React, { Fragment } from 'react';
import { NavLink } from 'react-router-dom';

class Courses extends React.Component {

    state = {
        data:[],
        isLoading:true,
        error:false
    }

    componentDidMount() {
        fetch('http://localhost:5000/api/courses', {
            method:'GET',
            headers: new Headers({'content-type':'application/json'}),
            mode:'cors'
        }).then(response => response.json()).then(data => {
            this.setState({ data, isLoading:false });
        }).catch(error => {
            this.setState({ error, isLoading:false });
        })
    }

    render() {
        return (
            <div className="bounds">
                {(this.state.error) ? <div>{this.state.error.message}</div> : null}
                {(this.state.isLoading)
                    ? <p>Loading...</p>
                    : <CourseList courses={this.state.data}/>
                }
            </div>
        )
    }
}

const CourseList = ({ courses }) => {
    return (
        <>
            {courses.map(course => <CourseListItem key={course._id} course={course}/>)}
            <CourseListCreateItem/>
        </>
    )
}

/**
 * List Item
 * @desc Renders a structured course list item
 * @param {object} course API course response object
 */
const CourseListItem = ({ course }) => {
    // Get course variables
    const { title, description, _id } = course;
    // Layout course item
    return (
        <div>
            <div className="grid-33">
                <NavLink to={`/courses/${_id}`} className="course--module course--link">
                    <h4 className="course--label">{title}</h4>
                    <h3 className="course--title" style={{height:'100%',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{description}</h3>
                </NavLink>
            </div>
        </div>
    )
}

/**
 * Create List Item
 * @desc Renders a 'New Course' clickable card
 */
const CourseListCreateItem = () => (
    <div className="grid-33">
        <NavLink to="/courses/create" className="course--module course--add--module">
        <h3 className="course--add--title">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 13 13" className="add">
                <polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 "></polygon>
            </svg>New Course
        </h3>
        </NavLink>
    </div>
)

export default Courses;