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

const postsLimit = 9;

class Account extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            isLoadingMore: false,
            user: null,
            currentBlock: "MAIN_BLOCK",
            blockLoading: false,
            subscribing: false
        }

        this.clientID = null;
        this.canFetchMorePosts = true;
    }

    componentDidMount() {
        this.clientID = cookieControl.get("userid");
        if(!this.clientID) window.location.reload();

        client.query({
            query: gql`
                query($url: String, $limit: Int) {
                    user(url: $url) {
                        id,
                        login,
                        posts(limit: $limit) {
                            id,
                            isMultimedia,
                            likesInt,
                            commentsInt,
                            preview {
                                id,
                                url,
                                type
                            }
                        },
                        name,
                        getName,
                        isVerified,
                        avatar,
                        postsInt,
                        followersInt,
                        followingInt,
                        bio,
                        registeredByExternal,
                        isFollowing
                    }
                }
            `,
            variables: {
                url: this.props.match.params.url,
                limit: postsLimit
            }
        }).then(({ data: { user } }) => {
            if(!user) return this.props.history.push(links["FEED_PAGE"].absolute);

            this.setState(() => ({
                user,
                isLoading: false
            }), () => {
                document.title = `${ user.getName } | FInstagram`;
            });
        }).catch(console.error);
    }

    loadBlock = (block, loadingMore = false) => {
        if(
            (block === this.state.currentBlock && !loadingMore) || !this.state.user || (
                loadingMore && (
                    !this.canFetchMorePosts ||
                    this.state.isLoadingMore
                )
            )
        ) return;

        const rBlock = {
            "MAIN_BLOCK": "posts",
            "SAVED_BLOCK": "savedPosts",
            "TAGGED_BLOCK": "taggedPosts"
        }[block];

        if(this.state.currentBlock !== block) {
            this.canFetchMorePosts = true;
            this.setState(() => ({
                currentBlock: block,
                blockLoading: rBlock && !this.state.user[rBlock]
            }));
        } else if(loadingMore) {
            this.setState(() => ({
                isLoadingMore: true
            }));
        }

        if(!rBlock) return;

        client.query({
            query: gql`
                query($targetID: ID, $limitPosts: Int, $cursorID: ID) {
                    user(targetID: $targetID) {
                        id,
                        ${ rBlock }(limit: $limitPosts, cursorID: $cursorID) {
                            id,
                            isMultimedia,
                            likesInt,
                            commentsInt,
                            preview {
                                id,
                                url,
                                type
                            }
                        }
                    }
                }
            `,
            variables: {
                targetID: this.state.user.id,
                limit: postsLimit,
                cursorID: (!loadingMore || !this.state.user[rBlock]) ? null : this.state.user[rBlock].slice(-1)[0].id
            }
        }).then(({ data: { user: _user } }) => {
            this.setState(() => ({
                blockLoading: false,
                isLoadingMore: false
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

            let _a = this.state.user[rBlock];
            if(_a) _a = _a.map(io => io.id);

            this.setState(({ user }) => ({
                user: {
                    ...user,
                    ...((!user[rBlock] || !loadingMore) ? _user : {
                        [rBlock]: [
                            ...user[rBlock],
                            ..._user.posts.filter(({ id }) => !_a.includes(id))
                        ]
                    })
                }
            }));

            this.canFetchMorePosts = _user.length >= postsLimit;
        }).catch(console.error);
    }

    subscribe = () => {
        if(this.state.subscribing || !this.state.user || this.state.user.id === this.clientID) return;

        this.setState(() => ({
            subscribing: true
        }));

        client.mutate({
            mutation: gql`
                mutation($targetID: ID!) {
                    subscribeToUser(targetID: $targetID) {
                        id,
                        followersInt,
                        followingInt,
                        isFollowing
                    }
                }
            `,
            variables: {
                targetID: this.state.user.id
            }
        }).then(({ data: { subscribeToUser } }) => {
            this.setState(() => ({
                subscribing: false
            }));
            if(!subscribeToUser) return this.props.castError("Oops... unexpected error. Please, try again");

            this.setState(({ user }) => ({
                user: {
                    ...user,
                    ...subscribeToUser
                }
            }));
        });
    }

    render() {
        return(
            <div className="rn rn-account" onScroll={({ target }) => {
                if(target.scrollTop + target.offsetHeight > target.scrollHeight - 15) {
                    this.loadBlock(this.state.currentBlock, true);
                }    
            }}>
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
                                        { (!this.state.user.registeredByExternal) ? this.state.user.login : this.state.user.name }
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
                                    (this.state.user.id !== this.clientID) ? (
                                        <button className="definp rn-account-info-mat-name-action" onClick={ this.subscribe }>
                                            {
                                                (!this.state.subscribing) ? (
                                                    `Subscribe${ (!this.state.user.isFollowing) ? "" : "d" }`
                                                ) : (
                                                    <img src={ loadingSpinner } alt="loading spinner" className="glei-lspinner almparent" />
                                                )
                                            }
                                        </button>
                                    ) : (
                                        <>
                                            <Link to={ links["SETTINGS_PAGE"].absolute }>
                                                <button className="definp rn-account-info-mat-name-action">
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
                                                                action: () => {
                                                                    cookieControl.delete("userid");
                                                                    window.location.href = "/";
                                                                },
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
                                    )
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
                                onClick={ () => this.loadBlock(block) }>
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
                {
                    (!this.state.isLoadingMore) ? null : (
                        <img
                            className="glei-lspinner"
                            alt="loading spinner"
                            src={ loadingSpinner }
                        />
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
