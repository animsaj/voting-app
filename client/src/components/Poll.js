import React from 'react';
import PropTypes from 'prop-types';
import { getPoll, votePoll } from './../services/pollsServices';

import { Container, Message, Icon, Form, Radio, Button } from 'semantic-ui-react';



class Poll extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            poll: null,
            loading: true,
            value: '',
            warning: ''
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e, { value }) {
        this.setState({ ...this.state, value, warning: '' })
    }

    handleSubmit() {
        if (!this.state.value) {
            this.setState({
                ...this.state,
                warning: 'You have to select one option in order to to submit a vote'
            });
        } else {
            votePoll(this.props.id, this.state.value).then(response => {
                if (response.response.status === 400) {
                    this.setState({
                        ...this.state,
                        warning: response.response.data,
                        value: ''
                    })
                } else {
                    console.log(response);
                }
            })
        }
    }

    componentDidMount() {
        getPoll(this.props.id).then(poll => {
            this.setState({
                ...this.state,
                poll,
                loading: false,
            })
        })
    }

    renderPoll() {
        const { question, options } = this.state.poll;
        return (
            <Form onSubmit={this.handleSubmit}>
                <Form.Field>
                    <h3>{question}</h3>
                </Form.Field>
                {options.map(option => {
                    const { text, _id } = option;
                    return (
                        <Form.Field key={_id}>
                            <Radio
                                label={text}
                                name='radioGroup'
                                value={_id}
                                checked={this.state.value === _id}
                                onChange={this.handleChange}
                            />
                        </Form.Field>
                    )
                })}
                <Button color='green' type='submit'>Submit</Button>
            </Form>
        )
    }

    renderLoading() {
        return (
            <Message icon>
                <Icon name='circle notched' loading />
                <Message.Content>
                    <Message.Header>Just one second</Message.Header>
                    We are fetching that content for you.
                </Message.Content>
            </Message>
        )
    }

    render() {
        return (
            <Container style={{ marginTop: '7em', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                {this.state.loading ? this.renderLoading() : this.renderPoll()}
                {this.state.warning && <Message warning><Message.Header>{this.state.warning}</Message.Header></Message>}
            </Container>
        );
    }
}

Poll.propTypes = {
    id: PropTypes.string
};

export default Poll;
