// Modules
import React from 'react';
// Helpers
import { requireAuthentication } from './../../context/AuthService';
import { connectAPI } from './../../context/APIService';

class CreateCourse extends React.Component {

    state = {
        title:'',
        description:'',
        estimatedTime:0,
        materialsNeeded:''
    }

    constructor() {
        super();
        // Bindings
        this.didSelectCancel = this.didSelectCancel.bind(this);
        this.didSubmitForm = this.didSubmitForm.bind(this);
        this.handlePropertyChange = this.handlePropertyChange.bind(this);
    }

    didSelectCancel(event) {
        event.preventDefault()
        this.props.history.push('/');
    }

    didSubmitForm(event) {
        event.preventDefault();
        const { title, description, estimatedTime, materialsNeeded } = this.state;
        const { username, password } = this.props.user;

        this.props.api.send('courses', {
            title,
            description,
            estimatedTime,
            materialsNeeded
        }, { username, password });
    }

    handlePropertyChange({ target }) {
        if (Object.keys(this.state).includes(target.name))
            this.setState({ [target.name]:target.value });
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
                                    <input id="title" name="title" type="text" className="input-title course--title--input" placeholder="Course title..." defaultValue={this.state.title} onChange={this.handlePropertyChange}/>
                                </div>
                                <p>By Joe Smith</p>
                            </div>
                            <div className="course--description">
                                <div>
                                    <textarea id="description" name="description" className="" placeholder="Course description..." onChange={this.handlePropertyChange}></textarea>
                                </div>
                            </div>
                        </div>
                        <div className="grid-25 grid-right">
                            <div className="course--stats">
                                <ul className="course--stats--list">
                                    <li className="course--stats--list--item">
                                        <h4>Estimated Time</h4>
                                        <div>
                                            <input id="estimatedTime" name="estimatedTime" type="number" step={1} min={0} className="course--time--input" placeholder="Hours" defaultValue={this.state.estimatedTime} onChange={this.handlePropertyChange}/>
                                        </div>
                                    </li>
                                    <li className="course--stats--list--item">
                                        <h4>Materials Needed</h4>
                                        <div>
                                            <textarea id="materialsNeeded" name="materialsNeeded" className="" placeholder="List materials..." onChange={this.handlePropertyChange}></textarea>
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

export default connectAPI(requireAuthentication(CreateCourse));