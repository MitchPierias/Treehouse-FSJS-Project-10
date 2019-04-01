// Modules
import React from 'react';
import { Redirect } from 'react-router-dom';
import { requireAuthentication } from './../../context/AuthService';
import { connectAPI } from './../../context/APIService';

class UpdateCourse extends React.Component {

    state = {
        id:'',
        title:'',
        description:'',
        estimatedTime:'',
        materialsNeeded:'',
        user:{},
        redirect:false
    }

    constructor() {
        super();
        // Bindings
        this.didSubmitForm = this.didSubmitForm.bind(this);
        this.didSelectCancel = this.didSelectCancel.bind(this);
        this.handlePropertyChange = this.handlePropertyChange.bind(this);
    }

    componentDidMount() {
        const { id } = this.props.match.params;
        this.props.api.request(`courses/${id}`).then(({ courses }) => {
            const redirect = (!this.props.user.matches(courses.user));
            this.setState({ ...courses, id, redirect });
        })
    }

    didSelectCancel(event) {
        event.preventDefault()
        this.props.history.push(`/courses/${this.props.match.params.id}`);
    }

    didSubmitForm(event) {
        event.preventDefault();
        let { errors } = this.state;
        const { id } = this.props.match.params;
        const { title, description, estimatedTime, materialsNeeded } = this.state;
        const { username, password } = this.props.user;

        errors = {};
        if (title.length <= 0) errors['title'] = "Please provide a value for 'title'";
        if (description.length <= 0) errors['description'] = "Please provide a value for 'description'";
        if (estimatedTime <= 0) errors['duration'] = "Please provide a value for 'Estimated Time'";
        if (materialsNeeded.length <= 0) errors['materials'] = "Please provide a value for the 'Materials' needed";
        this.setState({ errors });
        if (Object.keys(errors).length > 0) return;

        this.props.api.update(`courses/${id}`, {
            title,
            description,
            estimatedTime,
            materialsNeeded
        }, { username, password }).then(() => {
            this.setState({ isLoading:false });
            this.props.history.push(`/courses/${id}`);
        });
    }

    handlePropertyChange({ target }) {
        if (Object.keys(this.state).includes(target.name))
            this.setState({ [target.name]:target.value });
    }

    render() {

        const { title, description, estimatedTime, materialsNeeded, user } = this.state;

        if (this.state.redirect)
            return <Redirect to="/forbidden"/>
        
        return (
            <div className="bounds course--detail">
                <h1>Update Course</h1>
                <div>
                    <form onSubmit={this.didSubmitForm}>
                        <div className="grid-66">
                            <div className="course--header">
                                <h4 className="course--label">Course</h4>
                                <div>
                                    <input id="title" name="title" type="text" className="input-title course--title--input" placeholder="Course title..." defaultValue={title}  onChange={this.handlePropertyChange}/>
                                </div>
                                <p>By {user.firstName} {user.lastName}</p>
                            </div>
                            <div className="course--description">
                                <div>
                                    <textarea id="description" name="description" placeholder="Course description..." value={description}  onChange={this.handlePropertyChange}/>
                                </div>
                            </div>
                        </div>
                        <div className="grid-25 grid-right">
                            <div className="course--stats">
                                <ul className="course--stats--list">
                                    <li className="course--stats--list--item">
                                        <h4>Estimated Time</h4>
                                        <div>
                                            <input id="estimatedTime" name="estimatedTime" type="number" step={1} min={0} className="course--time--input" placeholder="Hours" value={Number(estimatedTime.replace(/\D?/gi,''))} onChange={this.handlePropertyChange}/>
                                        </div>
                                    </li>
                                    <li className="course--stats--list--item">
                                        <h4>Materials Needed</h4>
                                        <div>
                                            <textarea id="materialsNeeded" name="materialsNeeded" placeholder="List materials..." value={materialsNeeded} onChange={this.handlePropertyChange}/>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="grid-100 pad-bottom">
                            <button className="button" type="submit">Update Course</button>
                            <button className="button button-secondary" onClick={this.didSelectCancel}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default connectAPI(requireAuthentication(UpdateCourse));