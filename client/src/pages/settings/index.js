import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import './main.css';

import { gql } from 'apollo-boost';
import { connect } from 'react-redux';

import client from '../../apollo';
import api from '../../api';
import links from '../../links';
import runTheme from '../../theme.runner';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

import placeholderINST from '../__forall__/placeholderINST.gif';
import loadingSpinner from '../__forall__/loadingico.gif'

class Input extends Component {
    static defaultProps = {
        isInput: true,
        _type: "text",
        isValid: null

    }

    render() {
        return(
            <div className="rn-settings-window-options-itemrails rn-settings-window-options-account">
                <div className="rn-settings-window-options-stitle">
                    <span className="rn-settings-window-options-stitle-mat">
                        { this.props.text }
                    </span>
                </div>
                <div className="rn-settings-window-options-sbody">
                    {
                        (!this.props.isLoading) ? (
                            (this.props.isInput) ? (
                                <>
                                    <input
                                        className="rn-settings-window-options-sbody-input definp"
                                        type={ this.props._type }
                                        title={ this.props._title }
                                        defaultValue={ this.props.defVal }
                                        required={ this.props._required }
                                        onChange={ ({ target: { value } }) => this.props._onChange(value) }
                                        disabled={ this.props._disabled }
                                    />
                                    {
                                        (this.props.isValid === null) ? null : (
                                            <div className="rn-settings-window-options-sbody-inputstatus">
                                                <FontAwesomeIcon icon={ (this.props.isValid) ? faCheck : faTimes } />
                                            </div>
                                        )
                                    }
                                </>
                            ) : (
                                <textarea
                                    className="rn-settings-window-options-sbody-input textarea definp"
                                    title={ this.props._title }
                                    defaultValue={ this.props.defVal }
                                    required={ this.props._required }
                                    onChange={ ({ target: { value } }) => this.props._onChange(value) }
                                />
                            )
                        ) : (
                            <img
                                alt="loading placeholder"
                                src={ placeholderINST }
                                className="rn-settings-window-options-sbody-input placeholder"
                            />
                        )
                    }
                </div>
            </div>
        );
    }
}

Input.propTypes = {
    text: PropTypes.string.isRequired,
    isInput: PropTypes.bool,
    _type: PropTypes.string,
    defVal: PropTypes.string,
    _onChange: PropTypes.func.isRequired,
    _disabled: PropTypes.bool,
    _required: PropTypes.bool.isRequired
}

class Select extends Component {
    render() {
        return(
            <div className="rn-settings-window-options-itemrails">
                <div className="rn-settings-window-options-stitle">
                    <span className="rn-settings-window-options-stitle-mat">
                        { this.props.text }
                    </span>
                </div>
                <div className="rn-settings-window-options-sbody">
                    {
                        (!this.props.isLoading) ? (
                            <select
                                defaultValue={ this.props._defaultValue.toLowerCase() }
                                className="rn-settings-window-options-sbody-select definp"
                                onChange={ ({ target: { value } }) => this.props._onChange(value) }>
                                {
                                    this.props.options.map((session, index) => (
                                        <option value={ session.value } key={ index }>{ session.text }</option>
                                    ))
                                }
                            </select>
                        ) : (
                            <img
                                src={ placeholderINST }
                                alt="loading placeholder"
                                className="rn-settings-window-options-sbody-select placeholder"
                            />
                        )
                    }
                </div>
            </div>
        );
    }
}

Select.propTypes = {
    text: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    _onChange: PropTypes.func.isRequired,
    _defaultValue: PropTypes.string.isRequired
}

class SubmitBtn extends PureComponent {
    static defaultValue = {
        _disabled: false
    }

    render() {
        return(
            <button
                type="submit"
                className={ `rn-settings-window-options-itemrails-submit definp${ (!this.props.isLoading) ? "" : " loading" }` }
                disabled={ this.props._disabled }>
                {
                    (!this.props.isLoading) ? (
                        this.props.text
                    ) : (
                        <img src={ loadingSpinner } alt="loading spinner" className="glei-lspinner almparent" />
                    )
                }
            </button>
        )
    }
}

SubmitBtn.propTypes = {
    text: PropTypes.string.isRequired,
    isLoading: PropTypes.bool.isRequired,
    _disabled: PropTypes.bool
}

class Toggle extends PureComponent {
    render() {
        return(
            <div className="rn-settings-window-options-itemrails">
                <div className="rn-settings-window-options-stitle">
                    <span className="rn-settings-window-options-stitle-mat">
                        { this.props.text }
                    </span>
                </div>
                <div className="rn-settings-window-options-sbody">
                    <button className={ `rn-settings-window-options-sbody-toggle definp${ (!this.props.active) ? "" : " active" }` } onClick={ () => this.props._onChange(!this.props.active) }>
                        <div />
                    </button>
                </div>
            </div>
        );
    }
}

Toggle.propTypes = {
    text: PropTypes.string.isRequired,
    active: PropTypes.bool.isRequired,
    _onChange: PropTypes.func.isRequired
}

class SettingsProfile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            login: null,
            name: null,
            bio: null,
            email: null,
            gender: null,
            emailValid: null,
            loginValid: null,
            submittingData: false,
            avatar: null,
            avatarPreview: null,
            validatingData: false
        }

        this.validatingDataINT = null;
    }

    validateUser() {
        clearTimeout(this.validatingDataINT);
        this.validatingDataINT = setTimeout(() => {
            if(this.state.validatingData || (!this.state.login && !this.state.email)) return;

            const { email, login } = this.state;

            this.setState(() => ({
                validatingData: true
            }));

            client.query({
                query: gql`
                    query($email: String!, $login: String!) {
                        validateUser(email: $email, login: $login)
                    }
                `,
                variables: {
                    email: (email && this.props.client.email !== email) ? email : "",
                    login: (login && this.props.client.login !== login) ? login : ""
                }
            }).then(({ data: { validateUser } }) => {
                this.setState(() => ({
                    validatingData: false
                }));
                if(!validateUser) return this.props.castError("Something went wrong");

                // 0 - email
                // 1 - login

                let [emailValid, loginValid] = validateUser;

                this.setState(() => ({
                    emailValid, loginValid
                }));
            }).catch(console.error);
        }, 400);
    }

    submit = () => {
        const { login, name, bio, email, gender, avatar } = this.state;

        if(
            this.state.submittingData || (
                (!login || login === this.props.client.login) &&
                (!name || name === this.props.client.name) &&
                (!bio || bio === this.props.client.bio) &&
                (!email || email === this.props.client.email) &&
                (!gender || gender === this.props.client.gender) &&
                !avatar
            )
        ) return;

        this.setState(() => ({
            submittingData: true
        }));

        client.mutate({
            mutation: gql`
                mutation($login: String, $name: String, $bio: String, $email: String, $gender: String, $avatar: Upload) {
                    settingAccountData(login: $login, name: $name, bio: $bio, email: $email, gender: $gender, avatar: $avatar) {
                        id
                    }
                }
            `,
            variables: {
                login: login || "",
                name: name || "",
                bio: bio || "",
                email: email || "",
                gender: gender || "",
                avatar: avatar || null
            }
        }).then(({ data: { settingAccountData } }) => {
            this.setState(() => ({
                submittingData: false
            }));
            if(!settingAccountData) return this.props.castError("Something went wrong. Please, try again.");
        });
    }

    render() {
        return(
            <form className="rn-settings-window-options" onSubmit={ e => { e.preventDefault(); this.submit(); } }>
                <div className="rn-settings-window-options-itemrails rn-settings-window-options-account">
                    <div className="rn-settings-window-options-stitle">
                        <div className="rn-settings-window-options-account-avatar">
                            <img src={ (!this.props.isLoading) ? this.state.avatarPreview || (api.storage + this.props.client.avatar) : placeholderINST } alt="profile" />
                        </div>
                    </div>
                    <div className="rn-settings-window-options-sbody rn-settings-window-options-account-name">
                        {
                            (!this.props.isLoading) ? (
                                <>
                                    <span className="rn-settings-window-options-account-name-mat">{ this.props.client.getName }</span>
                                    <label
                                        htmlFor="rn-settings-window-options-account-name-changep_input"
                                        type="button"
                                        className="rn-settings-window-options-account-name-changep definp">
                                        Change Profile Photo
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        id="rn-settings-window-options-account-name-changep_input"
                                        onChange={({ target: { files: [file] } }) => (file) ? (file => {
                                            this.setState(() => ({
                                                avatar: file,
                                                avatarPreview: URL.createObjectURL(file)
                                            }));
                                        })(file) : null}
                                    />
                                </>
                            ) : (
                                <img
                                    className="glei-placeholder text bgh one3"
                                    src={ placeholderINST }
                                    alt="loading placeholder"
                                />
                            )
                        }
                    </div>
                </div>
                <Input
                    text="Login"
                    _type="text"
                    _onChange={(value) => {
                        this.setState({ login: value }, this.validateUser);
                    }}
                    isLoading={ this.props.isLoading }
                    defVal={ (this.props.client && this.props.client.login) || "" }
                    isValid={ this.state.loginValid }
                    _disabled={ this.props.client && this.props.client.registeredByExternal }
                    _required={ true }
                />
                <Input
                    text="Name"
                    _type="text"
                    _onChange={ value => this.setState({ name: value }) }
                    isLoading={ this.props.isLoading }
                    defVal={ (this.props.client && this.props.client.name) || "" }
                    _disabled={ this.props.client && this.props.client.registeredByExternal }
                    _required={ false }
                />
                <Input
                    text="Bio"
                    isInput={ false }
                    _onChange={ value => this.setState({ bio: value }) }
                    isLoading={ this.props.isLoading }
                    defVal={ (this.props.client && this.props.client.bio) || "" }
                    _required={ false }
                />
                <Input
                    text="Email"
                    _type="text"
                    _onChange={(value) => {
                        this.setState({ email: value }, this.validateUser);
                    }}
                    isLoading={ this.props.isLoading }
                    isValid={ this.state.emailValid }
                    defVal={ (this.props.client && this.props.client.email) || "" }
                    _disabled={ this.props.client && this.props.client.registeredByExternal }
                    _required={ true }
                />
                <Select
                    text="Gender"
                    _onChange={ value => this.setState({ gender: value }) }
                    isLoading={ this.props.isLoading }
                    _defaultValue={ (this.props.client && this.props.client.gender) || "unknown" } // XXX
                    options={[
                        {
                            value: "male",
                            text: "Male"
                        },
                        {
                            value: "female",
                            text: "Female"
                        },
                        {
                            value: "unknown",
                            text: "Not Specified"
                        }
                    ]}
                />
                {
                    (!this.props.isLoading) ? (
                        <SubmitBtn
                            text="Submit"
                            isLoading={ this.state.submittingData }
                            _disabled={
                                this.state.validatingData || this.state.submittingData ||
                                this.state.emailValid === false || this.state.loginValid === false
                            }
                        />
                    ) : null
                }
            </form>
        );
    }
}

class SettingsPassword extends Component {
    constructor(props) {
        super(props);

        this.state = {
            oldPassword: null,
            newPassword: null,
            c_newPassword: null,
            submittingData: false,
            alert: null
        }
    }

    submit = () => {
        const { oldPassword, newPassword, c_newPassword } = this.state;

        if(
            this.state.submittingData || !oldPassword ||
            !newPassword || !c_newPassword
        ) return;

        if(newPassword !== c_newPassword) return (
            this.setState(() => ({
                alert: { text: "Oops... passwords are not the same.", isError: true }
            }))
        );
        else if(newPassword === oldPassword) return(
            this.setState(() => ({
                alert: { text: "newPassword = oldPassword? Huhh..", isError: true }
            }))
        );

        this.setState(() => ({
            submittingData: true,
            alert: null
        }));

        client.mutate({
            mutation: gql`
                mutation($oldPassword: String!, $newPassword: String!) {
                    settingAccountPassword(oldPassword: $oldPassword, newPassword: $newPassword) {
                        id
                    }
                }
            `,
            variables: {
                oldPassword: this.state.oldPassword,
                newPassword: this.state.newPassword
            }
        }).then(({ data: { settingAccountPassword } }) => {
            this.setState(() => ({
                submittingData: false
            }))

            this.setState(() => ({
                alert: (settingAccountPassword) ? {
                    text: "Success",
                    isError: false
                } : {
                    text: "Invalid old password",
                    isError: true
                }
            }));
        }).catch(console.error);
    }

    render() {
        return(
            <form className="rn-settings-window-options" onSubmit={ e => { e.preventDefault(); this.submit(); } }>
                <div className="rn-settings-window-options-itemrails rn-settings-window-options-account">
                    <div className="rn-settings-window-options-stitle">
                        <div className="rn-settings-window-options-account-avatar">
                            <img src={ (!this.props.isLoading) ? api.storage + this.props.client.avatar : placeholderINST } alt="profile" />
                        </div>
                    </div>
                    <div className="rn-settings-window-options-sbody rn-settings-window-options-account-name">
                        <span className="rn-settings-window-options-account-name-mat big">oles.odynets</span>
                    </div>
                </div>
                <Input
                    text="Old password"
                    _type="password"
                    _onChange={ value => this.setState({ oldPassword: value }) }
                    _required={ true }
                />
                <Input
                    text="New password"
                    _type="password"
                    _onChange={ value => this.setState({ newPassword: value }) }
                    _required={ true }
                />
                <Input
                    text="Confirm New Password"
                    _type="password"
                    _onChange={ value => this.setState({ c_newPassword: value }) }
                    _required={ true }
                />
                {
                    (!this.state.alert) ? null : (
                        <p className={ `rn-settings-window-cpass-error${ (!this.state.alert.isError) ? " success" : "" }` }>{ this.state.alert.text }</p>
                    )
                }
                <SubmitBtn
                    text="Change Password"
                    isLoading={ this.state.submittingData }
                />
            </form>
        );
    }
}

class SettingsAppearance extends Component {
    constructor(props) {
        super(props);

        this.state = {
            darkMode: localStorage.getItem("design_style") === "DARK"
        }
    }

    toggleDarkMode = () => {
        this.setState(({ darkMode: a }) => ({
            darkMode: !a
        }), () => {
            const theme = (this.state.darkMode === false) ? "LIGHT" : "DARK";

            localStorage.setItem("design_style", theme);
            runTheme(theme);
        });
    }

    render() {
        return(
            <div className="rn-settings-window-options">
                <Toggle
                    _onChange={ this.toggleDarkMode }
                    active={ this.state.darkMode }
                    text="Dark Mode"
                />
            </div>
        );
    }
}

class Settings extends Component {
    constructor(props) {
        super(props);

        this.startTab = "EDIT_PROFILE";

        this.state = {
            tab: this.startTab,
            client: null,
            isLoading: true
        }
    }

    componentDidMount() {
        { // Hook
            let a = this.props.match.params.hook;
            if(a) {
                this.setState(() => ({
                    tab: {
                        'eprofile': "EDIT_PROFILE",
                        'cpass': "CHANGE_PASSWORD",
                        'appearance': "DESIGN_STYLE"
                    }[a] || this.startTab
                }), this.loadData); // Two times, because this function should be fired after state appling.
            } else {
                this.loadData();
            }
        }

        document.title = `Settings | FInstagram`;
    }

    setTab = tab => {
        this.setState({ tab });
        window.history.pushState(null, null, `${ links["SETTINGS_PAGE"].absolute }/${{
            "EDIT_PROFILE": 'eprofile',
            "CHANGE_PASSWORD": 'cpass',
            "DESIGN_STYLE": 'appearance'
        }[tab]}`);
    }

    loadData = () => {
        const fields = {
            "EDIT_PROFILE": `
                login,
                name,
                bio,
                email,
                gender
            `
        }[this.state.tab];

        client.query({
            query: gql`
                query {
                    user {
                      id,
                      getName,
                      avatar,
                      registeredByExternal,
                      ${ fields || "" }  
                    }
                }
            `
        }).then(({ data: { user } }) => {
            if(!user) return this.props.castError("Something went wrong...");

            // If I'd add more tabs.. and now
            this.setState(({ client }) => ({
                client: (!client) ? user : ({
                    ...client,
                    ...user
                }),
                isLoading: false
            }));
        }).catch(console.error);
    }

    render() {
        return(
            <div className="rn rn-settings">
                <div className="rn-settings-window">
                    <menu className="rn-settings-window-nav">
                        {
                            [
                                {
                                    tabName: "EDIT_PROFILE",
                                    text: "Edit Profile"
                                },
                                {
                                    tabName: "CHANGE_PASSWORD",
                                    text: "Change password"
                                },
                                {
                                    tabName: "DESIGN_STYLE",
                                    text: "Appearance"
                                }
                            ].map(({ text, tabName }, index) => (
                                <button
                                    key={ index }
                                    className={ `rn-settings-window-nav-btn definp${ (this.state.tab !== tabName) ? "" : " active" }` }
                                    onClick={ () => this.setTab(tabName) }>
                                    { text }
                                </button>       
                            ))
                        }
                    </menu>
                    {
                        {
                            "EDIT_PROFILE": (
                                <SettingsProfile
                                    client={ this.state.client }
                                    isLoading={ this.state.isLoading }
                                    castError={ this.props.castError }
                                />
                            ),
                            "CHANGE_PASSWORD": (
                                <SettingsPassword
                                    client={ this.state.client }
                                    isLoading={ this.state.isLoading }
                                    castError={ this.props.castError }
                                />
                            ),
                            "DESIGN_STYLE": (
                                <SettingsAppearance />
                            )
                        }[this.state.tab]
                    }
                </div>
            </div>
        );
    }
}

const mapStateToProps = () => ({});

const mapActionsToProps = {
    castError: text => ({ type: "CAST_GLOBAL_ERROR", payload: { text } })
}

export default connect(
    mapStateToProps,
    mapActionsToProps
)(Settings);