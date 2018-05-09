import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import history from './history'
import 'semantic-ui-css/semantic.min.css';

import App from './components/App';

ReactDOM.render(
    <Router history={history}>
        <App />
    </Router>,
    document.getElementById('app')
);