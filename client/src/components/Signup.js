import React from 'react';
import PropTypes from 'prop-types';
import history from './../history';
import { Container, Message, Form, Button } from 'semantic-ui-react';


class Signup extends React.Component {
    constructor(props) {
        super(props);
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
            this.props.onSignup(email, password).then(response => {
                if (!response) {
                    this.setState({
                        ...this.state,
                        warning: 'Password has to be at least 6 characters long and email has to be correct'
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
            <Container style={{ marginTop: '7em', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Form onSubmit={this.handleSubmit}>
                    <Form.Field>
                        <h3>Sign Up</h3>
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

Signup.propTypes = {
    onSignup: PropTypes.func
};

export default Signup;

