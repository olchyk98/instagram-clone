import React, { Component } from 'react';
import './main.css';

import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { gql } from 'apollo-boost';

import links from '../../links';
import client from '../../apollo';
import { cookieControl } from '../../utils';
import api from '../../api';

import AccountPost from '../__forall__/post.preview';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faTh, faUserTag } from '@fortawesome/free-solid-svg-icons';
import { faBookmark } from '@fortawesome/free-regular-svg-icons';

import verification_image from '../__forall__/images/verification.png';
import placeholderGIF from '../__forall__/placeholderFB.gif';
import placeholderGIF_I from '../__forall__/placeholderINST.gif';
import loadingSpinner from '../__forall__/loadingico.gif';


class Account extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            user: null,
            currentBlock: "MAIN_BLOCK",
            blockLoading: false
        }

        this.clientID = null;
    }

    componentDidMount() {
        this.clientID = cookieControl.get("userid");
        if(!this.clientID) window.location.reload();

        client.query({
            query: gql`
                query($url: String) {
                    user(url: $url) {
                        id,
                        login,
                        posts {
                            id,
                            isMultimedia,
                            likesInt,
                            commentsInt,
                            preview {
                                url,
                                type
                            }
                        },
                        name,
                        isVerified,
                        avatar,
                        postsInt,
                        followersInt,
                        followingInt,
                        bio,
                        registeredByFacebook
                    }
                }
            `,
            variables: {
                url: this.props.match.params.url
            }
        }).then(({ data: { user } }) => {
            if(!user) return this.props.history.push(links["FEED_PAGE"].absolute);

            this.setState(() => ({
                user,
                isLoading: false
            }));
        }).catch(console.error);
    }

    chooseBlock = block => {
        if(block === this.state.currentBlock || !this.state.user) return;

        const rBlock = {
            "SAVED_BLOCK": "savedPosts",
            "TAGGED_BLOCK": "taggedPosts"
        }[block];

        this.setState(() => ({
            currentBlock: block,
            blockLoading: rBlock && !this.state.user[rBlock]
        }));

        if(!rBlock) return;

        client.query({
            query: gql`
                query($targetID: ID) {
                    user(targetID: $targetID) {
                        id,
                        ${ rBlock } {
                            id,
                            isMultimedia,
                            likesInt,
                            commentsInt,
                            preview {
                                url,
                                type
                            }
                        }
                    }
                }
            `,
            variables: {
                targetID: this.state.user.id
            }
        }).then(({ data: { user: _user } }) => {
            this.setState(() => ({
                blockLoading: false
            }));

            if(!_user) return this.props.castError("Whooops.. SOmething went wrong..");

//             let a = {}
// 
//             switch(block) {
//                 case 'SAVED_BLOCK':
//                     a.savedPosts = user.savedPosts;
//                 break;
//                 case 'TAGGED_BLOCK':
//                     a.taggedPosts = user.taggedPosts;
//                 break;
//                 default:break;
//             }

            this.setState(({ user }) => ({
                user: {
                    ...user,
                    ..._user
                }
            }));
        }).catch(console.error);
    }

    render() {
        return(
            <div className="rn rn-account">
                <header className="rn-account-info  rn-account-section">
                    <section className="rn-account-info-avatar">
                        {
                            (!this.state.isLoading) ? (
                                <img src={ api.storage + this.state.user.avatar } alt="user" />
                            ) : (
                                <img className="glei-placeholder fullparent" alt="This user was verified by finstagram administration" src={ placeholderGIF_I } />
                            )
                        }
                    </section>
                    <section className="rn-account-info-mat">
                        <div className="rn-account-info-mat-name">
                            {
                                (!this.state.isLoading) ? (
                                    <span className="rn-account-info-mat-name-mat">
                                        { (!this.state.user.registeredByFacebook) ? this.state.user.login : this.state.user.name }
                                    </span>
                                ) : (
                                    <img className="glei-placeholder text one3 bgh" alt="placeholder" src={ placeholderGIF } />
                                )
                            }
                            {
                                (!this.state.isLoading && !this.state.user.isVerified) ? null : (
                                    <div className="rn-account-info-mat-name-verification">
                                        {
                                            (!this.state.isLoading) ? (
                                                <img alt="verification icon" src={ verification_image } />
                                            ) : (
                                                <img className="glei-placeholder avatar margin prevent r" alt="This user was verified by finstagram administration" src={ placeholderGIF_I } />
                                            )
                                        }
                                    </div>
                                )
                            }
                            {
                                (!this.state.isLoading) ? (
                                    <>
                                        <Link to={ links["SETTINGS_PAGE"].absolute }>
                                            {
                                                (this.state.user.id !== this.clientID) ? null : (
                                                    <button className="definp rn-account-info-mat-name-edit">
                                                        Edit profile
                                                    </button>
                                                )
                                            }
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
                                    </>
                                ) : null
                            }
                        </div>
                        <ul className="rn-account-info-mat-stats">
                            <li className="rn-account-info-mat-stats-item">
                                {
                                    (!this.state.isLoading) ? (
                                        <span className="rn-account-info-mat-stats-item-number">{ this.state.user.postsInt }</span>       
                                    ) : (
                                        <img className="glei-placeholder text value margin prevent r" alt="placeholder" src={ placeholderGIF } />
                                    )
                                }
                                <span className="rn-account-info-mat-stats-item-title">post{ (this.state.user && this.state.user.postsInt !== 1) ? "s" : "" }</span>
                            </li>
                            <li className="rn-account-info-mat-stats-item">
                                {
                                    (!this.state.isLoading) ? (
                                        <span className="rn-account-info-mat-stats-item-number">{ this.state.user.followersInt }</span>
                                    ) : (
                                        <img className="glei-placeholder text value margin prevent r" alt="placeholder" src={ placeholderGIF } />
                                    )
                                }
                                <span className="rn-account-info-mat-stats-item-title">followers</span>
                            </li>
                            <li className="rn-account-info-mat-stats-item">
                                {
                                    (!this.state.isLoading) ? (
                                        <span className="rn-account-info-mat-stats-item-number">{ this.state.user.followingInt }</span>
                                    ) : (
                                        <img className="glei-placeholder text value margin prevent r" alt="placeholder" src={ placeholderGIF } />
                                    )
                                }
                                <span className="rn-account-info-mat-stats-item-title">following</span>
                            </li>
                        </ul>
                        {
                            (!this.state.isLoading) ? (
                                <>
                                    {
                                        (this.state.user.name) ? (
                                            <span className="rn-account-info-realname">{ this.state.user.name }</span>
                                        ) : null
                                    }
                                    {
                                        (this.state.user.bio) ? (
                                            <p className="rn-account-info-description">{ this.state.user.bio }</p>
                                        ) : null
                                    }
                                </>
                            ) : null
                        }
                    </section>
                </header>
                <menu className="rn-account-postsmenu rn-account-section">
                    {
                        [
                            {
                                icon: faTh,
                                text: "Posts",
                                block: "MAIN_BLOCK"
                            },
                            {
                                icon: faBookmark,
                                text: "Saved",
                                block: "SAVED_BLOCK"
                            },
                            {
                                icon: faUserTag,
                                text: "Tagged",
                                block: "TAGGED_BLOCK"
                            }
                        ].map(({ icon, text, block }, index) => (
                            <button
                                key={ index }
                                title={ `See ${ text }` }
                                className={ `rn-account-postsmenu-btn definp${ (block !== this.state.currentBlock) ? "" : " active" }` }
                                onClick={ () => this.chooseBlock(block) }>
                                <FontAwesomeIcon icon={ icon } />
                                <span>{ text }</span>
                            </button>
                        ))
                    }
                </menu>
                {
                    (!this.state.isLoading && !this.state.blockLoading) ? (
                        <section className="rn-account-posts rn-account-section">
                            {
                                ({
                                    "MAIN_BLOCK": this.state.user.posts,
                                    "SAVED_BLOCK": this.state.user.savedPosts,
                                    "TAGGED_BLOCK": this.state.user.taggedPosts
                                }[this.state.currentBlock] || []).map(({ id, isMultimedia, likesInt, commentsInt, preview }, index) => (
                                    <AccountPost
                                        key={ id }
                                        id={ id }
                                        isMultimedia={ isMultimedia }
                                        commentsInt={ commentsInt }
                                        likesInt={ likesInt }
                                        preview={ preview }
                                    />
                                ))
                            }
                            
                        </section>
                    ) : (
                        <img className="glei-lspinner" alt="loading spinner" src={ loadingSpinner } />
                    )
                }
            </div>
        );
    }
}

const mapStateToProps = () => ({});

const mapActionsToProps = {
    callGlobalMenu: payload => ({ type: 'SET_GLOBAL_MENU', payload }),
    castError: text => ({ type: 'CAST_GLOBAL_ERROR', payload: { text } })
}

export default connect(
    mapStateToProps,
    mapActionsToProps
)(Account);
