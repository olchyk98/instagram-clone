import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './main.css';

const avatar = "https://instagram.fbtz1-2.fna.fbcdn.net/vp/c9ab85cb6f08ab4f94827ad427030841/5CDDD9F1/t51.2885-19/44884218_345707102882519_2446069589734326272_n.jpg?_nc_ht=instagram.fbtz1-2.fna.fbcdn.net";

class Input extends Component {
    static defaultProps = {
        isInput: true,
        _type: "text"
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
                        (this.props.isInput) ? (
                            <input
                                className="rn-settings-window-options-sbody-input definp"
                                type={ this.props._type }
                                title={ this.props._title }
                                defaultValue={ this.props.defVal }
                                onChange={ ({ target: { value } }) => this.props._onChange(value) }
                            />
                        ) : (
                            <textarea
                                className="rn-settings-window-options-sbody-input textarea definp"
                                title={ this.props._title }
                                defaultValue={ this.props.defVal }
                                onChange={ ({ target: { value } }) => this.props._onChange(value) }
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
    _onChange: PropTypes.func.isRequired
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
                    <select className="rn-settings-window-options-sbody-select definp" onClick={ ({ target: { value } }) => this.props._onChange(value) }>
                        {
                            this.props.options.map((session, index) => (
                                <option value={ session.value } key={ index }>{ session.text }</option>
                            ))
                        }
                    </select>
                </div>
            </div>
        );
    }
}

Select.propTypes = {
    text: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    _onChange: PropTypes.func.isRequired
}

class SettingsProfile extends Component {
    render() {
        return(
            <>
                <div className="rn-settings-window-options-itemrails rn-settings-window-options-account">
                    <div className="rn-settings-window-options-stitle">
                        <div className="rn-settings-window-options-account-avatar">
                            <img src={ avatar } alt="profile" />
                        </div>
                    </div>
                    <div className="rn-settings-window-options-sbody rn-settings-window-options-account-name">
                        <span className="rn-settings-window-options-account-name-mat">oles.odynets</span>
                        <button className="rn-settings-window-options-account-name-changel definp">
                            Change Profile Photo
                        </button>
                    </div>
                </div>
                <Input
                    text="Login"
                    _type="text"
                    _onChange={ value => null }
                />
                <Input
                    text="Name"
                    _type="text"
                    _onChange={ value => null }
                />
                <Input
                    text="Bio"
                    isInput={ false }
                    defVal=""
                    _onChange={ value => null }
                />
                <Input
                    text="Email"
                    _type="text"
                    _onChange={ value => null }
                />
                <Select
                    text="Gender"
                    _onChange={ value => null }
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
                {/* rotating ios spin |> fetch ac */}
                <button className="rn-settings-window-options-itemrails-submit definp">Submit</button>
            </>
        );
    }
}

class Hero extends Component {
    render() {
        return(
            <div className="rn rn-settings">
                <div className="rn-settings-window">
                    <menu className="rn-settings-window-nav">
                        <button className="rn-settings-window-nav-btn active definp">
                            Edit Profile
                        </button>
                        <button className="rn-settings-window-nav-btn definp">
                            Change password
                        </button>
                    </menu>
                    <section className="rn-settings-window-options">
                        <SettingsProfile />
                    </section>
                </div>
            </div>
        );
    }
}

export default Hero;