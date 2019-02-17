import React, { Component } from 'react';
import './main.css';

import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import links from '../../links';

import AccountPost from '../__forall__/post.preview';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faTh, faUserTag } from '@fortawesome/free-solid-svg-icons';
import { faBookmark } from '@fortawesome/free-regular-svg-icons';

import verification_image from '../__forall__/images/verification.png';

const avatar = "https://instagram.fbtz1-2.fna.fbcdn.net/vp/c9ab85cb6f08ab4f94827ad427030841/5CDDD9F1/t51.2885-19/44884218_345707102882519_2446069589734326272_n.jpg?_nc_ht=instagram.fbtz1-2.fna.fbcdn.net";

class Account extends Component {
    render() {
        return(
            <div className="rn rn-account">
                <header className="rn-account-info  rn-account-section">
                    <section className="rn-account-info-avatar">
                        <img src={ avatar } alt="user" />
                    </section>
                    <section className="rn-account-info-mat">
                        <div className="rn-account-info-mat-name">
                            <span className="rn-account-info-mat-name-mat">oles.odynets</span>
                            <div className="rn-account-info-mat-name-verification">
                                <img alt="This user was verified by finstagram administration" src={ verification_image } />
                            </div>
                            <Link to={ links["SETTINGS_PAGE"].absolute }>
                                <button className="definp rn-account-info-mat-name-edit">
                                    Edit profile
                                </button>
                            </Link>
                            <button
                                className="definp rn-account-info-mat-name-settings"
                                onClick={() => {
                                    this.props.callGlobalMenu({
                                        type: "OPTIONS",
                                        buttons: [
                                            {
                                                isRed: false,
                                                action: () => {
                                                    this.props.history.push(links["SETTINGS_PAGE"].absolute)
                                                },
                                                text: "Settings",
                                                close: true
                                            },
                                            {
                                                isRed: false,
                                                action: () => {
                                                    this.props.history.push(`${ links["SETTINGS_PAGE"].absolute }/cpass`);
                                                },
                                                text: "Change Password",
                                                close: true
                                            },
                                            {
                                                isRed: true,
                                                action: () => null,
                                                text: "Log out",
                                                close: true
                                            },
                                            {
                                                isRed: false,
                                                action: () => this.props.callGlobalMenu(null),
                                                text: "Cancel"
                                            }
                                        ]
                                    })
                                }}>
                                <FontAwesomeIcon icon={ faCog } />
                            </button>
                        </div>
                        <ul className="rn-account-info-mat-stats">
                            <li className="rn-account-info-mat-stats-item">
                                <span className="rn-account-info-mat-stats-item-number">2</span>
                                <span className="rn-account-info-mat-stats-item-title">posts</span>
                            </li>
                            <li className="rn-account-info-mat-stats-item">
                                <span className="rn-account-info-mat-stats-item-number">14.5k</span>
                                <span className="rn-account-info-mat-stats-item-title">folowers</span>
                            </li>
                            <li className="rn-account-info-mat-stats-item">
                                <span className="rn-account-info-mat-stats-item-number">94</span>
                                <span className="rn-account-info-mat-stats-item-title">following</span>
                            </li>
                        </ul>
                        <span className="rn-account-info-realname">Oles Odynets</span>
                        <p className="rn-account-info-description">Oles 🛌 7.9k Videobloger resting</p>
                    </section>
                </header>
                <menu className="rn-account-postsmenu rn-account-section">
                    {
                        [
                            {
                                icon: faTh,
                                text: "Posts"
                            },
                            {
                                icon: faBookmark,
                                text: "Saved"
                            },
                            {
                                icon: faUserTag,
                                text: "Tagged"
                            }
                        ].map(({ icon, text }, index) => (
                            <button title={ `See ${ text }` } key={ index } className={ `rn-account-postsmenu-btn definp${ (index !== 0) ? "" : " active" }` }>
                                <FontAwesomeIcon icon={ icon } />
                                <span>{ text }</span>
                            </button>
                        ))
                    }
                </menu>
                <section className="rn-account-posts rn-account-section">
                    <AccountPost />
                    <AccountPost />
                    <AccountPost />
                    <AccountPost />
                    <AccountPost />
                    <AccountPost />
                    <AccountPost />
                    <AccountPost />
                    <AccountPost />
                    <AccountPost />
                    <AccountPost />
                    <AccountPost />
                    <AccountPost />
                    <AccountPost />
                    <AccountPost />
                </section>
            </div>
        );
    }
}

const mapStateToProps = () => ({});

const mapActionsToProps = {
    callGlobalMenu: payload => ({ type: 'SET_GLOBAL_MENU', payload })
}

export default connect(
    mapStateToProps,
    mapActionsToProps
)(Account);
