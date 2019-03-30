// Modules
import React from 'react';
import { NavLink } from 'react-router-dom';
import { connectAuthentication } from './Authentication';

class UserSignUp extends React.Component {

    state = {
        firstName:'',
        lastName:'',
        emailAddress:'',
        password:'',
        confirmPassword:''
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
        const { firstName, lastName, emailAddress, password } = this.state;
        if (this.state.password !== this.state.confirmPassword) return;
        this.props.user.signUp(emailAddress, password, firstName, lastName);
    }

    handlePropertyChange({ target }) {
        if (Object.keys(this.state).includes(target.name))
            this.setState({ [target.name]:target.value });
    }

    render() {
        return (
            <div className="bounds">
                <div className="grid-33 centered signin">
                    <h1>Sign Up</h1>
                    <div>
                        <form onSubmit={this.didSubmitForm}>
                            <div>
                                <input id="firstName" name="firstName" type="text" placeholder="First Name" onChange={this.handlePropertyChange}/>
                            </div>
                            <div>
                                <input id="lastName" name="lastName" type="text" placeholder="Last Name" onChange={this.handlePropertyChange}/>
                            </div>
                            <div>
                                <input id="emailAddress" name="emailAddress" type="text" placeholder="Email Address" onChange={this.handlePropertyChange}/>
                            </div>
                            <div>
                                <input id="password" name="password" type="password" placeholder="Password" onChange={this.handlePropertyChange}/>
                            </div>
                            <div>
                                <input id="confirmPassword" name="confirmPassword" type="password" placeholder="Confirm Password" onChange={this.handlePropertyChange}/>
                            </div>
                            <div className="grid-100 pad-bottom">
                                <button className="button" type="submit">Sign Up</button>
                                <button className="button button-secondary" onClick={this.didSelectCancel}>Cancel</button>
                            </div>
                        </form>
                    </div>
                    <p>&nbsp;</p>
                    <p>Already have a user account? <NavLink to="/signin">Click here</NavLink> to sign in!</p>
                </div>
            </div>
        )
    }
}

export default connectAuthentication(UserSignUp);