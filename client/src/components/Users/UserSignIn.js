// Modules
import React from 'react';
import { NavLink } from 'react-router-dom';
import { connectAuthentication } from './../../context/AuthService';

class UserSignIn extends React.Component {

    state = {
        emailAddress:'',
        password:''
    }

    constructor() {
        super();
        // Bindings
        this.didSelectCancel = this.didSelectCancel.bind(this);
        this.didSubmitForm = this.didSubmitForm.bind(this);
        this.handleChangeForProp = this.handleChangeForProp.bind(this)
    }

    /**
     * Cancel
     * @desc Redirects home
     * @param {HTMLFormEvent} event Button onclick event 
     */
    didSelectCancel(event) {
        event.preventDefault()
        this.props.history.push('/');
    }

    /**
     * Submit
     * @desc Requests a signin action against the API
     * @param {HTMLFormEvent} event Submit button onclick event
     */
    didSubmitForm(event) {
        event.preventDefault();
        const { emailAddress, password } = this.state;
        this.props.user.signIn(emailAddress, password)
    }

    /**
     * Input Change
     * @desc Handles state updates for input value changes
     * @param {HTMLElement} target Changing input element
     * @note Assumes the state key is the input's `name` attribute
     */
    handleChangeForProp({ target }) {
        if (Object.keys(this.state).includes(target.name))
            this.setState({ [target.name]:target.value });
    }

    render() {
        const { emailAddress, password } = this.state;
        return (
            <div className="bounds">
                <div className="grid-33 centered signin">
                    <h1>Sign In</h1>
                    <div>
                        <form onSubmit={this.didSubmitForm}>
                            <div>
                                <input id="emailAddress" name="emailAddress" type="text" placeholder="Email Address" defaultValue={emailAddress} onChange={this.handleChangeForProp}/>
                            </div>
                            <div>
                                <input id="password" name="password" type="password" placeholder="Password" defaultValue={password} onChange={this.handleChangeForProp}/>
                            </div>
                            <div className="grid-100 pad-bottom">
                                <button className="button" type="submit">Sign In</button>
                                <button className="button button-secondary" onClick={this.didSelectCancel}>Cancel</button>
                            </div>
                        </form>
                    </div>
                    <p>&nbsp;</p>
                    <p>Don't have a user account? <NavLink to="/signup">Click here</NavLink> to sign up!</p>
                </div>
            </div>
        )
    }
}

export default connectAuthentication(UserSignIn);