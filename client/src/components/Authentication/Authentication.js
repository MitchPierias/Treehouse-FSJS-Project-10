// Modules
import React from 'react';
import { Redirect } from 'react-router-dom';
import { withRouter } from "react-router";
import base64 from 'base-64';
// Defaults
const initialState = { username:null, password:null, firstName:null, lastName:null }
const KEY_LOCAL_CREDENTIALS = 'credentials';

/**
 * Authentication Context
 * @desc Context initialized with an empty session
 * @private
 */
const AuthContext = React.createContext(initialState);

/**
 * Authentication Consumer
 * @desc Helper export for authentication consumer access
 */
export const AuthConsumer = AuthContext.Consumer;

/**
 * Connect Authentication
 * @desc Injects user session data into wrapped components
 * @param {React.Component} ComposedComponent Precomposed React Component for session injection
 */
export const connectAuthentication = (ComposedComponent) => (props) => (
    <AuthContext.Consumer>
        {(user) => <ComposedComponent {...props} user={user}/>}
    </AuthContext.Consumer>
)

/**
 * Require Authentication
 * @desc Handles unauthorised component requests using redirection
 * @param {React.Component} ComposedComponent Precomposed component to pass-through
 */
export const requireAuthentication = ComposedComponent => connectAuthentication((props) => {
    if (props.user.isLogged()) {
        return <ComposedComponent {...props}/>
    } else {
        return <Redirect to="/forbidden"/>;
    }
})

/**
 * Authentication Provider
 * @desc Configures the authentication provider with managed state
 * @note Router is injected prior to exporting
 */
class Authenticate extends React.Component {

    state = initialState;

    constructor() {
        super();
        // Bindings
        this.signOut = this.signOut.bind(this);
        this.signIn = this.signIn.bind(this);
        this.signUp = this.signUp.bind(this);
        this.isLogged = this.isLogged.bind(this);
        this.fullName = this.fullName.bind(this);
        this.matches = this.matches.bind(this);
        this.handleAPIResponse = this.handleAPIResponse.bind(this);
    }

    /**
     * Component Mounted
     * @desc Restore all stored session data
     */
    componentDidMount() {
        // Restore credentials from storage
        const credentials = JSON.parse(localStorage.getItem(KEY_LOCAL_CREDENTIALS)||'{}');
        this.setState({ ...credentials });
    }

    /**
     * Sign Out
     * @desc Resets the state and clears the persitant session
     */
    signOut() {
        // Invalidate all stoarge
        localStorage.removeItem(KEY_LOCAL_CREDENTIALS);
        this.setState(initialState);
    }

    /**
     * Handle API Response
     * @desc Handles headers and response metadata
     * @param {object} response Fetch response HTTP object
     */
    handleAPIResponse(response) {
        if (response.status >= 400)
            throw Error('Invalid credentials');
        if (response.headers.get('Location') && response.headers.get('Location') !== this.props.location.pathname)
            this.props.history.push(response.headers.get('Location'));
        else
            return response.json();
        return response;
    }

    signUp(emailAddress, password, firstName, lastName) {
        fetch(`http://localhost:5000/api/users`, {
            method:'POST',
            headers: new Headers({
                'Content-Type':'application/json',
                'Accept':'application/json',
                'Access-Control-Expose-Headers': 'Location'
            }),
            body: JSON.stringify({ emailAddress, password, firstName, lastName }),
            mode:'cors'
        }).then(this.handleAPIResponse).then(response => {
            this.setState({ username:emailAddress, password, firstName, lastName });
            localStorage.setItem(KEY_LOCAL_CREDENTIALS, JSON.stringify({ username:emailAddress, password, firstName, lastName }));
            this.props.history.push('/');
        }).catch(error => {
            console.log(error);
        })
    }

    signIn(username, password) {
        fetch(`http://localhost:5000/api/users`, {
            method:'GET',
            headers: new Headers({
                'Content-Type':'application/json',
                'Accept':'application/json',
                'Access-Control-Expose-Headers': 'Location',
                'Authorization': 'Basic '+base64.encode(username+":"+password)
            }),
            mode:'cors'
        }).then(this.handleAPIResponse).then(({ firstName, lastName }) => {
            this.setState({ username, password, firstName, lastName });
            localStorage.setItem(KEY_LOCAL_CREDENTIALS, JSON.stringify({ username, password, firstName, lastName }));
            this.props.history.push('/');
        })
    }

    /**
     * User Matches
     * @desc Compares the user session against specified session
     * @param {string} firstName Users first name to match
     * @param {string} lastName Users last name to match
     * @returns {boolean} Users match comparison result
     */
    matches({ firstName, lastName }) {
        // Compare first and last names of session and provided user
        return (this.state.firstName === firstName && this.state.lastName === lastName);
    }

    /**
     * User Is Logged
     * @desc Determines if users session credentials are stored
     * @returns {boolean} Session exists determiner
     */
    isLogged() {
        // Check session existence
        return localStorage.getItem(KEY_LOCAL_CREDENTIALS);
    }
    /**
     * User Full Name
     * @desc Simple helper method to concatenate a users fullname
     * @returns {string} User's fullname
     */
    fullName() {
        // Concatenate user name parts
        return this.state.firstName + ' ' + this.state.lastName;
    }

    render() {
        return (
            <AuthContext.Provider value={{
                ...this.state,
                isLogged:this.isLogged,
                signOut:this.signOut,
                fullName:this.fullName,
                signIn:this.signIn,
                signUp:this.signUp,
                matches:this.matches
            }}>
                {this.props.children}
            </AuthContext.Provider>
        )
    }
}

/**
 * Inject router into Authentication component
 */
export const AuthProvider = withRouter(Authenticate);