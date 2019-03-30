// Modules
import React from 'react';
// Helpers
import { requireAuthentication } from './../Authentication';
import base64 from 'base-64';

class CreateCourse extends React.Component {

    state = {
        errors:{},
        title:'',
        description:'',
        estimatedTime:0,
        materialsNeeded:'',
        requiredProperties:['title','description']
    }

    constructor() {
        super();
        // Bindings
        this.didSelectCancel = this.didSelectCancel.bind(this);
        this.didSubmitForm = this.didSubmitForm.bind(this);
        this.handleAPIResponse = this.handleAPIResponse.bind(this);
    }

    didSelectCancel(event) {
        event.preventDefault()
        this.props.history.push('/');
    }

    /**
     * Handle API Response
     * @desc Handles headers and response metadata
     * @param {object} response Fetch response HTTP object
     */
    handleAPIResponse(response) {
        if (response.status >= 400)
            throw Error('Invalid course');
        if (response.headers.get('Location') && response.headers.get('Location') !== this.props.location.pathname)
            this.props.history.push(response.headers.get('Location').replace(/\/api/gi,''));
        else
            return response.json();
        return response;
    }

    didSubmitForm(event) {
        event.preventDefault();
        let { errors } = this.state;
        const { title, description, estimatedTime, materialsNeeded } = this.state;
        const { username, password } = this.props.user;

        errors = {};
        if (title.length <= 0) errors['title'] = "Please provide a value for 'title'";
        if (description.length <= 0) errors['description'] = "Please provide a value for 'description'";
        if (estimatedTime <= 0) errors['duration'] = "Please provide a value for 'Estimated Time'";
        if (materialsNeeded.length <= 0) errors['materials'] = "Please provide a value for the 'Materials' needed";
        this.setState({ errors });
        if (Object.keys(errors).length > 0) return;

        fetch(`http://localhost:5000/api/courses`, {
            method:'POST',
            headers: new Headers({
                'Content-Type':'application/json',
                'Accept':'application/json',
                'Authorization': 'Basic '+base64.encode(username + ":" + password)
            }),
            body: JSON.stringify({ title, description, estimatedTime, materialsNeeded }),
            mode:'cors'
        }).then(this.handleAPIResponse).then(response => response.json()).then(({ courses }) => {
            this.setState({ ...courses, isLoading:false });
        }).catch(error => {
            console.log(error);
        });
    }

    render() {
        return (
            <div className="bounds course--detail">
                <h1>Create Course</h1>
                <div>
                    <ErrorView errors={this.state.errors}/>
                    <form onSubmit={this.didSubmitForm}>
                        <div className="grid-66">
                            <div className="course--header">
                                <h4 className="course--label">Course</h4>
                                <div>
                                    <input id="title" name="title" type="text" className="input-title course--title--input" placeholder="Course title..." defaultValue={this.state.title} onChange={({ target }) => this.setState({ title:target.value })}/>
                                </div>
                                <p>By Joe Smith</p>
                            </div>
                            <div className="course--description">
                                <div>
                                    <textarea id="description" name="description" className="" placeholder="Course description..." onChange={({ target }) => this.setState({ description:target.value })}></textarea>
                                </div>
                            </div>
                        </div>
                        <div className="grid-25 grid-right">
                            <div className="course--stats">
                                <ul className="course--stats--list">
                                    <li className="course--stats--list--item">
                                        <h4>Estimated Time</h4>
                                        <div>
                                            <input id="estimatedTime" name="estimatedTime" type="number" step={1} min={0} className="course--time--input" placeholder="Hours" defaultValue={this.state.estimatedTime} onChange={({ target }) => this.setState({ estimatedTime:(target.value+' hours') })}/>
                                        </div>
                                    </li>
                                    <li className="course--stats--list--item">
                                        <h4>Materials Needed</h4>
                                        <div>
                                            <textarea id="materialsNeeded" name="materialsNeeded" className="" placeholder="List materials..." onChange={({ target }) => this.setState({ materialsNeeded:target.value })}></textarea>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            </div>
                            <div className="grid-100 pad-bottom">
                                <button className="button" type="submit">Create Course</button>
                                <button className="button button-secondary" onClick={this.didSelectCancel}>Cancel</button>
                            </div>
                    </form>
                </div>
            </div>
        )
    }
}

/**
 * Error View
 * @desc Renders errors if set
 * @param {object} errors Object of field indexed errors 
 */
const ErrorView = ({ errors={} }) => {

    if (Object.keys(errors).length <= 0) return null;
    // Layout errors
    return (
        <div>
            <h2 className="validation--errors--label">Validation errors</h2>
            <div className="validation-errors">
                <ul>
                    {Object.values(errors).map(message => <li key={message}>{message}</li>)}
                </ul>
            </div>
        </div>
    )
}

export default requireAuthentication(CreateCourse);