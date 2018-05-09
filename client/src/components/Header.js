import React from 'react';
import PropTypes from 'prop-types';
import { Button, Menu, Container } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

const Header = ({ user, onLogOut }) => {
    const buttons = user ? (
        <React.Fragment>
            <Link to="/me/polls" style={{ marginLeft: '0.5em' }}>My Polls</Link>
            <Link to="/add" style={{ marginLeft: '0.5em' }}>Add</Link>
            <Button inverted onClick={onLogOut} style={{ marginLeft: '1em' }}>Log out</Button>
        </React.Fragment>
    ) : (
            <React.Fragment>
                <Link to="/login"><Button inverted style={{ marginLeft: '0.5em' }}>Log in</Button></Link>
                <Link to="/signup"><Button inverted style={{ marginLeft: '0.5em' }}>Sign Up</Button></Link>
            </React.Fragment>
        );

    return (
        <Menu fixed='top' inverted>
            <Container>
                <Menu.Item header>
                    VotingApp
          </Menu.Item>
                <Menu.Item><Link to="/">All Polls</Link></Menu.Item>
                <Menu.Item position='right'>
                    {buttons}
                </Menu.Item>
            </Container>
        </Menu>
    );
};

Header.propTypes = {
    user: PropTypes.object,
    onLogOut: PropTypes.func
};

export default Header;
