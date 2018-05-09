import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import { getUser, logOut, signUpUser, logInUser } from './../services/userServices';
import Header from './Header';
import AllPolls from './AllPolls';
import Login from './Login';
import Signup from './Signup';
import Poll from './Poll';


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null
        }
        this.handleSignup = this.handleSignup.bind(this);
        this.logOutUser = this.logOutUser.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
    }

    componentDidMount() {
        let token = localStorage.getItem('token');
        if (!token || token === '') {
            return;
        }
        getUser(token).then(response => {
            this.setState({
                user: response.data
            })
        })

    }

    logOutUser() {
        let token = localStorage.getItem('token');
        logOut(token).then(() => {
            this.setState({
                user: null
            });
            localStorage.removeItem('token');
        })

    }

    handleSignup(email, password) {
        return signUpUser(email, password).then(response => {
            if (response.status === 200) {
                this.setState({
                    user: response.data
                });
                localStorage.setItem('token', response.headers['x-auth'])
                return response;
            }
        }, err => err)
    }

    handleLogin(email, password) {
        return logInUser(email, password).then(response => {
            if (response.status === 200) {
                this.setState({
                    user: response.data
                });
                localStorage.setItem('token', response.headers['x-auth'])
                return response;
            }
        }, err => err)
    }

    render() {
        return (
            <Container>
                <Header user={this.state.user} onLogOut={this.logOutUser} />
                <main>
                    <Switch>
                        <Route exact path='/' component={AllPolls} />
                        <Route path='/login' render={props => <Login {...props} onLogin={this.handleLogin} />} />
                        <Route path='/signup' render={props => <Signup {...props} onSignup={this.handleSignup} />} />
                        <Route path='/polls/:id' render={props => <Poll {...props} id={props.match.params.id} user={this.state.user} />} />
                        <Redirect to="/" />
                    </Switch>
                </main>
            </Container>
        );
    }
}

export default App;

