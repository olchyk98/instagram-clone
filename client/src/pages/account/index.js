import React, { Component } from 'react';
import './main.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faTh, faUserTag } from '@fortawesome/free-solid-svg-icons';
import { faBookmark } from '@fortawesome/free-regular-svg-icons';

import verification_image from '../__forall__/images/verification.png';

const avatar = "https://instagram.fbtz1-2.fna.fbcdn.net/vp/c9ab85cb6f08ab4f94827ad427030841/5CDDD9F1/t51.2885-19/44884218_345707102882519_2446069589734326272_n.jpg?_nc_ht=instagram.fbtz1-2.fna.fbcdn.net";

class AccountPost extends Component {
    render() {
        return(
            <p>q</p>
        );
    }
}

class Account extends Component {
    render() {
        return(
            <div className="rn rn-account">
                <header className="rn-account-info">
                    <section className="rn-account-info-avatar">
                        <img src={ avatar } alt="user" />
                    </section>
                    <section className="rn-account-info-mat">
                        <div className="rn-account-info-mat-name">
                            <span className="rn-account-info-mat-name-mat">oles.odynets</span>
                            <div className="rn-account-info-mat-name-verification">
                                <img alt="This user was verificated by finstagram administration" src={ verification_image } />
                            </div>
                            <button className="definp rn-account-info-mat-name-edit">
                                Edit profile
                            </button>
                            <button className="definp rn-account-info-mat-name-settings">
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
                <menu className="rn-account-postsmenu">
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
                <section className="rn-account-posts">
                    <AccountPost />
                </section>
            </div>
        );
    }
}

export default Account;