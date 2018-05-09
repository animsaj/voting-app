import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { getPolls } from './../services/pollsServices';

import { Container, Button, Card, Header, Message, Icon } from 'semantic-ui-react'


class AllPolls extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            polls: [],
            loading: true
        }
    }

    componentDidMount() {
        getPolls().then(data => {
            this.setState({
                polls: data,
                loading: false
            })
        });
    }

    renderAllPolls() {
        const content = this.state.polls.length > 0 ? (
            <Card.Group>
                {this.state.polls.map(poll => {
                    return (
                        <Card style={{ padding: '2em' }} key={poll._id}>
                            <Card.Content>
                                <Card.Header>{poll.question}</Card.Header>
                            </Card.Content>
                            <Card.Content extra>
                                <Link to={`/polls/${poll._id}`}><Button basic color='blue'>View Poll</Button></Link>
                            </Card.Content>
                        </Card>
                    )
                })}
            </Card.Group>
        ) : (
                <Header as='h3' textAlign='center'>
                    There are no polls to vote.<Link to="/signup">Sign Up</Link> or < Link to="/login" > Log in</Link > to create some.
        </Header >
            );
        return content;
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
            <Container style={{ marginTop: '7em' }}>
                {this.state.loading ? this.renderLoading() : this.renderAllPolls()}
            </Container>
        );
    }
}

export default AllPolls;

