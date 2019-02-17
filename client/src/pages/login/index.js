import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import './main.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle, faCheckCircle } from '@fortawesome/free-regular-svg-icons';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';

import logo from './images/logo.png';

class Input extends PureComponent {
    static defaultProps = {
        isValid: null
    }

    render() {
        return(
            <div className="rn-login-island_register-input">
                <input
                    type={ this.props._type }
                    placeholder={ this.props._placeholder }
                    className="rn-login-island_register-input-mat definp"
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
    _placeholder: PropTypes.string
}

class Register extends Component {
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
                    isValid={ null }
                />
                <Input
                    _type="text"
                    _placeholder="Full Name"
                    isValid={ null }
                />
                <Input
                    _type="text"
                    _placeholder="Login"
                    isValid={ null }
                />
                <Input
                    _type="password"
                    _placeholder="Password"
                    isValid={ null }
                />
                <button type="submit" className="definp rn-login-island-btn">
                    Register
                </button>
            </form>
        );
    }
}

class Login extends Component {
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
                />
                <Input
                    _type="password"
                    _placeholder="Password"
                    isValid={ null }
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
