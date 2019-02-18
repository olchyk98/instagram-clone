import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import './main.css';

import { gql } from 'apollo-boost';

import { cookieControl } from '../../utils';
import client from '../../apollo';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle, faCheckCircle } from '@fortawesome/free-regular-svg-icons';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';

import logo from './images/logo.png';

class Input extends PureComponent {
    static defaultProps = {
        isValid: null,
        _required: true
    }

    render() {
        return(
            <div className="rn-login-island_register-input">
                <input
                    type={ this.props._type }
                    placeholder={ this.props._placeholder }
                    className="rn-login-island_register-input-mat definp"
                    onChange={ ({ target: { value } }) => this.props._onChange(value) }
                    required={ this.props._required }
                />
                <div className={ `rn-login-island_register-input-status${ (this.props.isValid === null) ? "" : (this.props.isValid === true) ? " green" : " red" }` }>
                    {
                        (this.props.isValid === true) ? (
                            <FontAwesomeIcon icon={ faCheckCircle } />
                        ) : (this.props.isValid === false) ? (
                            <FontAwesomeIcon icon={ faTimesCircle } />
                        ) : null
                    }
                </div>
            </div>
        );
    }
}

Input.propTypes = {
    _type: PropTypes.string,
    _placeholder: PropTypes.string,
    _onChange: PropTypes.func.isRequired,
    _required: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool
    ]),
    isValid: PropTypes.bool
}

class Register extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            name: "",
            login: "",
            password: "",
            loginValidated: null,
            emailValidated: null
        }

        this.validateUserINT = null;
    }

    fireValidateUser = () => {
        clearTimeout(this.validateUserINT);
        this.validateUserINT = setTimeout(this.validateUser, 200);
    }

    validateUser = () => {
        client.query({
            query: gql`
                query($email: String!, $login: String!) {
                    validateUser(email: $email, login: $login)
                }
            `,
            variables: {
                email: this.state.email,
                login: this.state.login
            }
        }).then(({ data: { validateUser } }) => {
            this.setState(() => {
                let a = {}

                if(validateUser === 0) {
                    a.loginValidated = a.emailValidated = true;
                } else if(validateUser === 1) {
                    a.loginValidated = false;
                    a.emailValidated = null;
                } else if(validateUser === 2) {
                    a.emailValidated = false;
                    a.loginValidated = null;
                } else if(validateUser === 3) {
                    a.loginValidated = a.emailValidated = false;
                }

                return a;
            });
        }).catch(console.error);
    }

    register = () => {
        client.mutate({
            mutation: gql`
                mutation($email: String!, $name: String!, $login: String!, $password: String!) {
                    registerUser(email: $email, name: $name, login:$ login, password: $password) {
                        id
                    }
                }
            `
        }).then(() => {

        }).catch(() => {

        })
    }

    render() {
        return(
            <form className="rn-login-island rn-login-island_register" onSubmit={ e => e.preventDefault() }>
                <div className="rn-login-island-logo">
                    <img src={ logo } alt="Instagram logo" />
                </div>
                <p className="rn-login-island_register-inittxt">
                    Sign up to see photos and videos from your friends.
                </p>
                <button type="button" className="definp rn-login-island-btn">
                    <FontAwesomeIcon icon={ faFacebook } />
                    <span>Login with Facebook</span>
                </button>
                <div className="rn-login-island_register-regsplit">
                    <span>Or</span>
                </div>
                <Input
                    _type="email"
                    _placeholder="Email"
                    isValid={ this.state.emailValidated }
                    _onChange={ value => this.setState({ email: value }, this.fireValidateUser) }
                />
                <Input
                    _type="text"
                    _placeholder="Full Name"
                    _onChange={ value => this.setState({ name: value }) }
                />
                <Input
                    _type="text"
                    _placeholder="Login"
                    isValid={ this.state.loginValidated }
                    _onChange={ value => this.setState({ login: value }, this.fireValidateUser) }
                />
                <Input
                    _type="password"
                    _placeholder="Password"
                    _onChange={ value => this.setState({ password: value }) }
                />
                <button type="submit" className="definp rn-login-island-btn">
                    Register
                </button>
            </form>
        );
    }
}

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            login: "",
            password: ""
        }
    }

    render() {
        return(
            <form className="rn-login-island rn-login-island_register" onSubmit={ e => e.preventDefault() }>
                <div className="rn-login-island-logo">
                    <img src={ logo } alt="Instagram logo" />
                </div>
                <Input
                    _type="text"
                    _placeholder="Login or email"
                    isValid={ null }
                    _onChange={ value => this.setState({ login: value }) }
                />
                <Input
                    _type="password"
                    _placeholder="Password"
                    isValid={ null }
                    _onChange={ value => this.setState({ password: value }) }
                />
                <button type="submit" className="definp rn-login-island-btn">
                    Login
                </button>
            </form>
        );
    }
}

class Auth extends Component {
    constructor(props) {
        super(props);

        this.state = {
            stage: "REGISTER_STAGE"
        }
    }

    render() {
        return(
            <div className="rn rn_nonav rn-login">
                {
                    (this.state.stage === "REGISTER_STAGE") ? (
                        <>
                            <Register />
                            <div className="rn-login-island rn-login-island-translogin">
                                <div className="rn-login-island-translogin-title">
                                    <span>Have an account?</span>
                                    <button onClick={ () => this.setState({ stage: "LOGIN_STAGE" }) } className="definp">Log in</button>
                                </div>
                            </div>
                        </>
                    ) : ( // LOGIN_STAGE
                        <>
                            <Login />
                            <div className="rn-login-island rn-login-island-translogin">
                                <div className="rn-login-island-translogin-title">
                                    <span>Don't have an account?</span>
                                    <button onClick={ () => this.setState({ stage: "REGISTER_STAGE" }) } className="definp">Register</button>
                                </div>
                            </div>
                        </>
                    )
                }
            </div>
        );
    }
}

export default Auth;
