// Modules
import React from 'react';
import base64 from 'base-64';
import { NavLink } from 'react-router-dom';
import { connectAuthentication } from './../Authentication';

class CourseDetail extends React.Component {

    state = {
        isLoading:true,
        title:'',
        description:'',
        materialsNeeded:'',
        estimatedTime:0,
        user:{}
    }

    constructor() {
        super();
        // Bindings
        this.didSelectDelete = this.didSelectDelete.bind(this);
    }

    componentDidMount() {
        const { id } = this.props.match.params;
        fetch(`http://localhost:5000/api/courses/${id}`, {
            method:'GET',
            headers: new Headers({ 'Content-Type':'application/json' }),
            mode:'cors'
        }).then(response => response.json()).then(({ courses }) => {
            this.setState({ ...courses, isLoading:false });
        }).catch(error => {
            console.log(error);
        });
    }

    didSelectDelete() {
        const { id } = this.props.match.params;
        const { username, password } = this.props.user;
        fetch(`http://localhost:5000/api/courses/${id}`, {
            method:'DELETE',
            headers: new Headers({
                'Content-Type':'application/json',
                'Authorization': 'Basic '+base64.encode(username + ":" + password)
            }),
            mode:'cors'
        }).then(response => {
            this.props.history.push('/');
        }).catch(error => {
            console.log(error);
        });
    }

    render() {
        if (this.state.isLoading)
            return <div>Loading...</div>
        else
            return (
                <div>
                    <div className="actions--bar">
                        <div className="bounds">
                            <div className="grid-100">
                                {(!this.props.user.matches(this.state.user)) ? null : (
                                    <span>
                                        <NavLink to={`/courses/${this.props.match.params.id}/update`} className="button">Update Course</NavLink>
                                        <NavLink to={`/courses/${this.props.match.params.id}/delete`} className="button" onClick={this.didSelectDelete}>Delete Course</NavLink>
                                    </span>
                                )}
                                <NavLink to="/" className="button button-secondary">Return to List</NavLink>
                            </div>
                        </div>
                    </div>
                    <div className="bounds course--detail">
                        <div className="grid-66">
                            <div className="course--header">
                                <h4 className="course--label">Course</h4>
                                <h3 className="course--title">{this.state.title}</h3>
                                <p>By {this.state.user.firstName} {this.state.user.lastName}</p>
                            </div>
                            <div className="course--description">{this.state.description}</div>
                        </div>
                        <div className="grid-25 grid-right">
                            <div className="course--stats">
                                <ul className="course--stats--list">
                                    <li className="course--stats--list--item">
                                        <h4>Estimated Time</h4>
                                        <h3>{this.state.estimatedTime}</h3>
                                    </li>
                                    <li className="course--stats--list--item">
                                        <h4>Materials Needed</h4>
                                        <ul>
                                            {this.state.materialsNeeded.split(/[\\*\\,]+\s/gi).map((material, idx) => {
                                                return (material.length > 0) ? <li key={idx}>{material}</li> : null;
                                            })}
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )
    }
}

export default connectAuthentication(CourseDetail);