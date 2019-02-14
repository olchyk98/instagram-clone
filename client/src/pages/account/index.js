import React, { Component } from 'react';
import './main.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faTh, faUserTag, faPlay, faLayerGroup, faComment, faHeart } from '@fortawesome/free-solid-svg-icons';
import { faBookmark } from '@fortawesome/free-regular-svg-icons';

import verification_image from '../__forall__/images/verification.png';

const avatar = "https://instagram.fbtz1-2.fna.fbcdn.net/vp/c9ab85cb6f08ab4f94827ad427030841/5CDDD9F1/t51.2885-19/44884218_345707102882519_2446069589734326272_n.jpg?_nc_ht=instagram.fbtz1-2.fna.fbcdn.net";
const image = "https://scontent-arn2-1.cdninstagram.com/vp/9e635da13e9679ff8a49f40a1bd23aba/5C684DC2/t51.2885-15/e15/c0.90.720.720/s640x640/51620624_554252355057448_6032328941874377517_n.jpg?_nc_ht=scontent-arn2-1.cdninstagram.com";

class AccountPost extends Component {
    render() {
        return(
            <article className="rn-account-posts-item" title="Open photo">
                <div className="rn-account-posts-item-hover">
                    <div className="rn-account-posts-item-hover-stats">
                        <div>
                            <FontAwesomeIcon icon={ faHeart } />
                        </div>
                        <span>45.1k</span>
                    </div>
                    <div className="rn-account-posts-item-hover-stats">
                        <div>
                            <FontAwesomeIcon icon={ faComment } />
                        </div>
                        <span>524</span>
                    </div>
                </div>
                <div className="rn-account-posts-item-marks">
                    <span className="rn-account-posts-item-marks-item">
                        <FontAwesomeIcon icon={ faPlay } />
                    </span>
                    <span className="rn-account-posts-item-marks-item">
                        <FontAwesomeIcon icon={ faLayerGroup } />
                    </span>
                </div>
                <img className="rn-account-posts-item-preview" alt="preview"
                    src={ image }
                />
            </article>
        );
    }
}

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

export default Account;