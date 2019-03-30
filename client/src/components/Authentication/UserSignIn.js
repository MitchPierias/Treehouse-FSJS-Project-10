// Modules
import React from 'react';
import { NavLink } from 'react-router-dom';
import { connectAuthentication } from './Authentication';

class UserSignIn extends React.Component {

    state = {
        username:'',
        password:''
    }

    constructor() {
        super();
        // Bindings
        this.didSelectCancel = this.didSelectCancel.bind(this);
        this.didSubmitForm = this.didSubmitForm.bind(this);
        this.handleChangeForProp = this.handleChangeForProp.bind(this)
    }

    didSelectCancel(event) {
        event.preventDefault()
        this.props.history.push('/');
    }

    didSubmitForm(event) {
        event.preventDefault();
        const { username, password } = this.state;
        this.props.user.signIn(username, password)
    }

    handleChangeForProp(prop) {
        return (event) => {
            this.setState({ [prop]:event.target.value });
        }
    }

    render() {
        const { username, password } = this.state;
        return (
            <div className="bounds">
                <div className="grid-33 centered signin">
                    <h1>Sign In</h1>
                    <div>
                        <form onSubmit={this.didSubmitForm}>
                            <div>
                                <input id="emailAddress" name="emailAddress" type="text" placeholder="Email Address" defaultValue={username} onChange={this.handleChangeForProp('username')}/>
                            </div>
                            <div>
                                <input id="password" name="password" type="password" placeholder="Password" defaultValue={password} onChange={this.handleChangeForProp('password')}/>
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