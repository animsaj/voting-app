import React from 'react';
import PropTypes from 'prop-types';
import history from './../history';
import { Container, Message, Form, Button } from 'semantic-ui-react';


class Login extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            email: '',
            password: '',
            warning: ''
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e, { name, value }) {
        this.setState({ ...this.state, [name]: value, warning: '' })
    }

    handleSubmit() {
        const { email, password } = this.state;
        if (!email || !password) {
            this.setState({
                ...this.state,
                warning: 'All the fields are required'
            });
        } else {
            this.props.onLogin(email, password).then(response => {
                if (!response) {
                    this.setState({
                        ...this.state,
                        warning: 'Incorrect email or passport'
                    });
                    return;
                }
                history.push('/')
            })
        }
    }

    render() {
        const { email, password } = this.state
        return (
            <Container style={{ marginTop: '7em' }}>
                <Form onSubmit={this.handleSubmit}>
                    <Form.Field>
                        <h3>Log In</h3>
                    </Form.Field>
                    <Form.Input placeholder='Email' name='email' value={email} onChange={this.handleChange} />
                    <Form.Input placeholder='Password' name='password' type='password' value={password} onChange={this.handleChange} />
                    <Form.Button content='Submit' />
                </Form>
                {this.state.warning && <Message warning><Message.Header>{this.state.warning}</Message.Header></Message>}
            </Container>
        );
    }
}

Login.propTypes = {
    onLogin: PropTypes.func
};

export default Login;

