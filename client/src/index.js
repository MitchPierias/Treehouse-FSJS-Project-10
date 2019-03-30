import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
// Components
import Views from './App';
import Header from './components/Header';
import Authentication from './components/Authentication';
// Styles
import './index.css';

/**
 * Application
 * @desc The core application structure goes here
 * @note This is where global providers like authenitcaion and Redux should wrap our core layout
 */
const App = (
    <BrowserRouter>
        <Authentication>
            <div>
                <Header/>
                <hr/>
                <Views/>
            </div>
        </Authentication>
    </BrowserRouter>
)

ReactDOM.render(App, document.getElementById('root'));
// Defualt `create-react-app` service worker
serviceWorker.unregister();
