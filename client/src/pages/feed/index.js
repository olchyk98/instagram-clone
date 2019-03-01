import React, { Component } from 'react';
import './main.css';

import { gql } from 'apollo-boost';
import { connect } from 'react-redux';

import api from '../../api';
import client from '../../apollo';
import { cookieControl } from '../../utils';

import Post from '../__forall__/post';

import placeholderINST from '../__forall__/placeholderINST.gif';

const postCommentsLimit = 15;

class Feed extends Component {
    render() {
        return(
            <section className="rn-feed-block rn-feed-mat">
                {
                    (this.props.feed) ? (
                        this.props.feed.map(({ id, likesInt, creator, comments, media, isLiked, text, inBookmarks, people, places }, index) => (
                            <Post
                                key={ id }
                                id={ id }
                                likesInt={ likesInt }
                                text={ text }
                                aid={ creator.id }
                                aname={ creator.getName }
                                aavatar={ creator.avatar }
                                comments={ comments }
                                media={ media }
                                isLiked={ isLiked }
                                inBookmarks={ inBookmarks }
                                people={ people }
                                places={ places }
                            />
                        ))
                    ) : (
                        <div className="rn-feed-mat-placeholder">
                            <img src={ placeholderINST } alt="placeholder" className="glei-placeholder text margin l" />
                            <img src={ placeholderINST } alt="placeholder" className="glei-placeholder text one3 margin l" />
                            <img src={ placeholderINST } alt="placeholder" className="glei-placeholder big margin prevent ts" />
                        </div>
                    )
                }
            </section>
        );
    }
}

class More extends Component {
    render() {
        return(
            <section className="rn-feed-block rn-feed-more">
                <div className="rn-feed-more-account">
                    <div className="rn-feed-more-account-avatar">
                        <img src={ (this.props.client && api.storage + this.props.client.avatar) || placeholderINST } alt="user" />
                    </div>
                    <div className="rn-feed-more-account-name">
                        {
                            (this.props.client) ? (
                                <>
                                    <span className="rn-feed-more-account-name-url">{ (!this.props.client.rbfb) ? this.props.client.login : this.props.client.name }</span>
                                    <span className="rn-feed-more-account-name-mat">{ (!this.props.client.rbfb) ? this.props.client.name : this.props.client.email }</span>
                                </>
                            ) : (
                                <>
                                    <img src={ placeholderINST } alt="placeholder" className="glei-placeholder text one3" />
                                    <img src={ placeholderINST } alt="placeholder" className="glei-placeholder text one3" />
                                </>
                            )
                        }
                    </div>
                </div>
                <span className="rn-feed-more-copyright">
                    @FINSTAGRAM, 2019. <br />
                    Instagram fake. <br />
                    by Oles Odynets
                </span>
            </section>
        );
    }
}

class Hero extends Component {
    constructor(props) {
        super(props);

        this.state = {
            client: null,
            posts: null
        }

        this.feedSubscription = null;
    }

    componentDidMount() {
        this.fetchMain();
    }

    componentWillUnmount() {
        if(this.feedSubscription) this.feedSubscription.unsubscribe();
    }

    fetchMain = () => {
        client.query({
            query: gql`
                query($commentsLimit: Int) {
                    user {
                        id,
                        name,
                        login,
                        email,
                        avatar,
                        registeredByExternal,
                        feed {
                            id,
                            likesInt,
                            isLiked,
                            inBookmarks,
                            text,
                            people {
                                id,
                                getName
                            },
                            places,
                            media {
                                id,
                                url,
                                type
                            },
                            creator {
                                id,
                                getName,
                                avatar
                            },
                            comments(limit: $commentsLimit) {
                                id,
                                creator {
                                    id,
                                    getName
                                },
                                isLiked,
                                content
                            }
                        }
                    }
                }
            `,
            variables: {
                commentsLimit: postCommentsLimit
            },
            fetchPolicy: 'no-cache'
        }).then(({ data: { user } }) => {
            if(!user) return this.props.castError("Something went wrong");

            this.setState(() => ({
                client: {
                    id: user.id,
                    name: user.name,
                    login: user.login,
                    avatar: user.avatar,
                    rbfb: user.registeredByExternal,
                    email: user.email
                },
                posts: user.feed
            }), this.subscribeToFeed);
        }).catch(console.error);
    }

    subscribeToFeed() {
        this.feedSubscription = client.subscribe({
            query: gql`
                subscription($id: ID!, $commentsLimit: Int) {
                    listenForFeed(id: $id) {
                        id,
                        likesInt,
                        isLiked,
                        inBookmarks,
                        text,
                        people {
                            id,
                            getName
                        },
                        places,
                        media {
                            id,
                            url,
                            type
                        },
                        creator {
                            id,
                            getName,
                            avatar
                        },
                        comments(limit: $commentsLimit) {
                            id,
                            creator {
                                id,
                                getName
                            },
                            isLiked,
                            content
                        }
                    }
                }
            `,
            variables: {
                commentsLimit: postCommentsLimit,
                id: cookieControl.get("userid")
            }
        }).subscribe({
            next: (({ data: { listenForFeed: a } }) => {
                if(!a) return;

                console.log(a);

                this.setState(({ posts }) => ({
                    posts: [
                        a,
                        ...posts
                    ]
                }))
            }),
            error: console.error
        })
    }

    render() {
        return(
            <div className="rn rn-feed">
                <Feed
                    feed={ this.state.posts }
                />
                <More
                    client={ this.state.client }
                />
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
)(Hero);
