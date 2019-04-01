// Modules
import React from 'react';
import { withRouter } from "react-router";
import base64 from 'base-64';

const DEFAULT_URI = 'http://localhost:5000/api';

const APIContext = React.createContext();

/**
 * Connect API
 * @desc Wrapper function to inject the API utilities into the specified component
 * @param {React.Component} ComposedComponent Precomposed React component
 */
export const connectAPI = ComposedComponent => props => (
    <APIContext.Consumer>
        {context => <ComposedComponent {...props} api={context}/>}
    </APIContext.Consumer>
)

class APIProvider extends React.Component {

    state = {
        isLoading:true,
        errors:[]
    }

    constructor() {
        super();
        // Bindings
        this.fetch = this.fetch.bind(this);
        this.send = this.send.bind(this);
        this.update = this.update.bind(this);
        this.request = this.request.bind(this);
        this.delete = this.delete.bind(this);
        this.handleResponse = this.handleResponse.bind(this);
        this.pushError = this.pushError.bind(this);
    }

    /**
     * Modal
     * @desc Reference to the error modal background
     */
    modalBackground = React.createRef();

    /**
     * Join URI
     * @desc Concatenates a valid url from configured root and components
     * @param  {Array<string>} args Array of url compopnent strings
     */
    joinUri(...args) {
        const rootPath = this.props.url || DEFAULT_URI;
        return args.reduce((fullPath, ext) => fullPath+'/'+ext.replace(/^\/|\/$/gi,''), rootPath);
    }

    /**
     * Push Error
     * @desc Appends an error message which triggers a modal display
     * @param {string} message Error message to present
     */
    pushError(message) {
        const { errors } = this.state;
        errors.push(message);
        this.setState({ errors });
    }

    /**
     * Handle API Response
     * @desc Handles headers and response metadata
     * @param {object} response Fetch response HTTP object
     */
    handleResponse(response) {
        if (response.status >= 500)
            throw response.message;
        return response.json().then(data => {
            if (response.status == 404)
                this.props.history.push('/notfound');
            else if (response.status >= 400)
                this.pushError(data.message);
            return data;
        }).catch(error => {
            if (response.headers.get('Location') && response.headers.get('Location') !== this.props.location.pathname)
                this.props.history.push(response.headers.get('Location').replace(/^\/?api/gi,''));
        })
    }

    /**
     * Fetch
     * @desc GET resource shorthand method
     * @param {string} endPoint (optional) API endpoint
     * @param {object|boolean} withAuth (optional) Authorization details
     */
    fetch(endPoint, withAuth=false) {
        // Execute GET request with optional authentication
        return this.request(endPoint, 'GET', null, withAuth);
    }

    /**
     * Update
     * @desc PUT to resource shorthand method
     * @param {string} endPoint (optional) API endpoint
     * @param {object|null} (optional) Body data object
     * @param {object|boolean} withAuth (optional) Authorization details
     */
    update(endPoint, data, withAuth=false) {
        // Execute PUT request with arguments
        return this.request(endPoint, 'PUT', data, withAuth);
    }

    /**
     * Send
     * @desc POST to resource shorthand method
     * @param {string} endPoint (optional) API endpoint
     * @param {object|null} (optional) Body data object
     * @param {object|boolean} withAuth (optional) Authorization details
     */
    send(endPoint, data, withAuth=false) {
        // Execute request
        return this.request(endPoint, 'POST', data, withAuth);
    }

    /**
     * Delete
     * @desc DELETE resource shorthand method
     * @param {string} endPoint (optional) API endpoint
     * @param {object|boolean} withAuth (optional) Authorization details
     */
    delete(endPoint, withAuth=false) {
        // Execute delete request with arguemnts
        return this.request(endPoint, 'DELETE', null, withAuth);
    }

    /**
     * Request
     * @desc Configures a generic fetch request with options
     * @param {string} (optional) The API endpoint
     * @param {string} (optional) Request method
     * @param {object|null} (optional) Body data object
     * @param {object|boolean} (optional) Authorization details
     */
    request(endPoint='/', method='GET', data=null, withAuth=false) {
        // Configure options
        const withOptions = {
            method,
            headers: new Headers({
                'Content-Type':'application/json',
                'Accept':'application/json',
                'Access-Control-Expose-Headers': 'Location'
            }),
            mode:'cors'
        }
        // Append body data
        if (data !== null && 'object' === typeof data)
            withOptions.body = JSON.stringify(data);
        // Handle Authentication
        if (withAuth && 'object' === typeof withAuth && withAuth.username && withAuth.password) {
            const { username, password } = withAuth;
            withOptions.headers.set('Authorization', 'Basic '+base64.encode(username+":"+password));
        }
        // Execute request
        return fetch(this.joinUri(endPoint), withOptions).then(this.handleResponse).catch(error => {
            this.props.history.push('/error');
        })
    }

    render() {
        return (
            <APIContext.Provider value={{
                request:this.request,
                fetch:this.fetch,
                send:this.send,
                update:this.update,
                delete:this.delete,
                pushError:this.pushError
            }}>
                <div ref={this.modalBackground} style={{width:"100vw",height:"100vh",backgroundColor:"rgba(0,0,0,0.6)",position:"absolute",top:0,left:0,display:"flex",justifyContent:"center",alignItems:"center",zIndex:10000,visibility:((this.state.errors.length>0)?'visible':'hidden')}} onClick={event => {
                    if (event.target === this.modalBackground.current)
                        this.setState({ errors:[] });
                }}>
                    <div style={{backgroundColor:"white",padding:20,maxWidth:300,borderRadius:8}}>
                        <h4 className="validation--errors--label">Oops...</h4>
                        <br/>
                        <ul className="validation-errors">
                            {this.state.errors.map(message => <li key={message}>{message}</li>)}
                        </ul>
                        <br/>
                        <button className="button" onClick={e => {
                            e.preventDefault();
                            this.setState({ errors:[] });
                        }}>Okay</button>
                    </div>
                </div>
                {this.props.children}
            </APIContext.Provider>
        )
    }
}

export const APIService = withRouter(APIProvider);
export default APIService;