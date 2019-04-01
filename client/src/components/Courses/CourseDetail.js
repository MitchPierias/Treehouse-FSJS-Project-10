// Modules
import React from 'react';
import Markdown from 'markdown-to-jsx';
import { NavLink } from 'react-router-dom';
import { connectAuthentication } from './../../context/AuthService';
import { connectAPI } from './../../context/APIService';

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
        this.props.api.fetch(`courses/${id}`).then(({ courses }) => {
            this.setState({ ...courses, isLoading:false });
        });
    }

    didSelectDelete(event) {
        event.preventDefault();
        const { id } = this.props.match.params;
        const { username, password } = this.props.user;
        this.props.api.delete(`courses/${id}`, { username, password }).then(response => {
            this.props.history.push('/');
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
                            <div className="course--description">
                                <Markdown>{this.state.description}</Markdown>
                            </div>
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
                                        <Markdown>{this.state.materialsNeeded}</Markdown>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )
    }
}

export default connectAuthentication(connectAPI(CourseDetail));