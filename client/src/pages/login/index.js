import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import './main.css';

import { gql } from 'apollo-boost';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import GoogleLogin from 'react-google-login';

import { cookieControl } from '../../utils';
import client from '../../apollo';
import links from '../../links';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle, faCheckCircle } from '@fortawesome/free-regular-svg-icons';
import { faFacebook, faGoogle } from '@fortawesome/free-brands-svg-icons';

import logo from './images/logo.png';
import loadingSpinner from '../__forall__/loadingico.gif';

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
            emailValidated: null,
            registering: false,
            registeringByFB: false
        }

        this.validateUserINT = null;
    }

    fireValidateUser = () => {
        clearTimeout(this.validateUserINT);

        if(this.state.email || this.state.login) {
            this.validateUserINT = setTimeout(this.validateUser, 200);
        } else {
            this.setState(() => ({
                loginValidated: null,
                emailValidated: null
            }));
        }
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
            },
            fetchPolicy: 'no-cache'
        }).then(({ data: { validateUser } }) => {
            // Array[0] - Email
            // Array[1] - Login

            this.setState(() => ({
                emailValidated: validateUser[0],
                loginValidated: validateUser[1]
            }));
        }).catch(console.error);
    }

    register = (byExternal = false, data = null) => {
        if(
            this.state.registering ||
            this.state.registeringByFB || (
                !byExternal && (
                    !this.state.loginValidated ||
                    !this.state.emailValidated
                )
            )
        ) return;

        this.setState(() => ({
            [ (!byExternal) ? "registering" : "registeringByFB" ]: true
        }));

        if(!byExternal) {
            // eslint-disable-next-line
            var { email, name, login, password } = this.state;
            var pictureURL = "";
        } else if(data && data.id) {
            // Get data
            // eslint-disable-next-line
            var { id: password, name, email, picture } = data;
            login = "";
            pictureURL = (picture) ? picture.data.url : "";

            // Some of users (like me) have name in Cyrillic format.
            // So I'll just convert it to latin.

            const transCirLat = (
                {"Ё":"YO","Й":"I","Ц":"TS","У":"U","К":"K","Е":"E","Н":"N","Г":"G","Ш":"SH","Щ":"SCH","З":"Z","Х":"H","Ъ":"","ё":"yo","й":"i","ц":"ts","у":"u","к":"k","е":"e","н":"n","г":"g","ш":"sh","щ":"sch","з":"z","х":"h","ъ":"","Ф":"F","Ы":"I","В":"V","А":"a","П":"P","Р":"R","О":"O","Л":"L","Д":"D","Ж":"ZH","Э":"E","ф":"f","ы":"i","в":"v","а":"a","п":"p","р":"r","о":"o","л":"l","д":"d","ж":"zh","э":"e","Я":"Ya","Ч":"CH","С":"S","М":"M","И":"I","Т":"T","Ь":"","Б":"B","Ю":"YU","я":"ya","ч":"ch","с":"s","м":"m","и":"y","т":"t","ь":"","б":"b","ю":"yu"}
            );

            name = name.split('').map((io) => {
                // Unknown Char -> |
                // F => S Char -> X

                let a = transCirLat[io];
                if(typeof a === "string") return a;
                else return io;
            }).join("");
        } else {
            return; // Fatal error
        }

        client.mutate({
            mutation: gql`
                mutation($email: String!, $name: String!, $login: String, $password: String!, $byExternal: Boolean, $pictureURL: String) {
                    registerUser(email: $email, name: $name, login: $login, password: $password, byExternal: $byExternal, pictureURL: $pictureURL) {
                        id
                    }
                }
            `,
            variables: {
                email, name,
                login, password,
                byExternal, pictureURL
            }
        }).then(({ data: { registerUser } }) => {
            this.setState(() => ({
                [ (!byExternal) ? "registering" : "registeringByFB" ]: false
            }));

            if(!registerUser) return;

            cookieControl.set("userid", registerUser.id);
            cookieControl.delete("G_AUTHUSER_H"); // I have no idea why this cookie destroys whole application.
            window.location.href = links["FEED_PAGE"].absolute;

        }).catch(console.error);
    }

    render() {
        return(
            <form className="rn-login-island rn-login-island_register" onSubmit={ e => { e.preventDefault(); this.register(false); } }>
                <div className="rn-login-island-logo">
                    <img src={ logo } alt="Instagram logo" />
                </div>
                <p className="rn-login-island_register-inittxt">
                    Sign up to see photos and videos from your friends.
                </p>
                <FacebookLogin
                    appId="355951248461966"
                    callback={ data => (data.id) ? this.register(true, data) : null }
                    fields="id, name, email, picture"
                    isDisabled={ this.state.registering || this.state.registeringByFB }
                    render={props => (
                        <button onClick={ props.onClick } type="button" className="definp rn-login-island-btn">
                            {
                                (!this.state.registeringByFB) ? (
                                    <>
                                        <FontAwesomeIcon icon={ faFacebook } />
                                        <span>Login with Facebook</span>
                                    </>
                                ) : (
                                    <img src={ loadingSpinner } className="rn-login-island-btn-spinner" alt="loading spinner" />
                                )
                            }
                        </button>
                    )}
                />
                <GoogleLogin
                    clientId="485575764210-jdv452uq27bqpu5b9ulvuo34f5f57spv.apps.googleusercontent.com"
                    isDisabled={ this.state.registering || this.state.registeringByFB }
                    render={(props) => (
                        <button onClick={ props.onClick } type="button" className="definp rn-login-island-btn google minimalmargin">
                            {
                                (!this.state.registeringByFB) ? (
                                    <>
                                        <FontAwesomeIcon icon={ faGoogle } />
                                        <span>Login with Google</span>
                                    </>
                                ) : (
                                    <img src={ loadingSpinner } className="rn-login-island-btn-spinner" alt="loading spinner" />
                                )
                            }
                        </button>
                    )}
                    onSuccess={({ w3: { Eea: id, U3: email, ig: name } }) => {
                        /*
                            I don't know what's wrong with that API.
                            ...
                            Picture url is not valid... :| Thanks, fycken gugle
                        */

                        this.register(true, {
                            id, email, name,
                            picture: null
                        });
                    }}
                />
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
                    {
                        (!this.state.registering) ? <>Sign up</> : (
                            <img src={ loadingSpinner } className="rn-login-island-btn-spinner" alt="loading spinner" />
                        )
                    }
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
            password: "",
            logging: false,
            loginError: null
        }
    }

    login = () => {
        if(this.state.logging) return;

        this.setState(() => ({
            logging: true,
            loginError: null
        }));

        const { login, password } = this.state;

        client.mutate({
            mutation: gql`
                mutation($login: String!, $password: String!) {
                    loginUser(login: $login, password: $password) {
                        id
                    }
                }
            `,
            variables: {
                login, password
            }
        }).then(({ data: { loginUser } }) => {
            this.setState(() => ({
                logging: false
            }));

            if(!loginUser) return this.setState(() => ({
                loginError: "Oops... Invalid email or password"
            }));

            cookieControl.set("userid", loginUser.id);
            window.location.href = links["FEED_PAGE"].absolute;
        }).catch(console.error);
    }

    render() {
        return(
            <form className="rn-login-island rn-login-island_register" onSubmit={ e => { e.preventDefault(); this.login(); } }>
                <div className="rn-login-island-logo">
                    <img src={ logo } alt="Instagram logo" />
                </div>
                {
                    (!this.state.loginError) ? null : (
                        <p className="rn-login-island-error">
                            { this.state.loginError }
                        </p>
                    )
                }
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
                    {
                        (!this.state.logging) ? <>Login</> : (
                            <img src={ loadingSpinner } className="rn-login-island-btn-spinner" alt="loading spinner" />
                        )
                    }
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