import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
// Components
import Views from './App';
import Header from './components/Header';
import AuthProvider from './context/AuthService';
import { APIService } from './context/APIService';
// Styles
import './index.css';

/**
 * Application
 * @desc The core application structure goes here
 * @note This is where global providers like authenitcaion and Redux should wrap our core layout
 */
const App = (
    <BrowserRouter>
        <APIService url={'http://localhost:5000/api'}>
            <AuthProvider>
                <div>
                    <Header/>
                    <hr/>
                    <Views/>
                </div>
            </AuthProvider>
        </APIService>
    </BrowserRouter>
)

ReactDOM.render(App, document.getElementById('root'));
// Defualt `create-react-app` service worker
serviceWorker.unregister();
