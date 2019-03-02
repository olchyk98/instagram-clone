import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './main.css';

import { gql } from 'apollo-boost';
import { connect } from 'react-redux';

import api from '../../api';
import client from '../../apollo';

import Post from '../__forall__/post';

import placeholderINST from '../__forall__/placeholderINST.gif';
import loadingSpinner from '../__forall__/loadingico.gif'

const postCommentsLimit = 4;
const postsLimit = 5;

class Feed extends Component {
    render() {
        return(
            <section className="rn-feed-block rn-feed-mat">
                {
                    (this.props.feed) ? (
                        this.props.feed.map(({ id, likesInt, creator, comments, media, isLiked, text, inBookmarks, people, places, time }, index) => (
                            <Post
                                key={ id }
                                id={ id }
                                likesInt={ likesInt }
                                text={ text }
                                aid={ creator.id }
                                aname={ creator.getName }
                                aavatar={ creator.avatar }
                                time={ time }
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
                {
                    (!this.props.isLoadingMore) ? null : (
                        <img
                            src={ loadingSpinner }
                            alt="more posts loading spinner"
                            className="glei-lspinner margintb"
                        />
                    )
                }
            </section>
        );
    }
}

Feed.propTypes = {
    isLoadingMore: PropTypes.bool
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

class FeedPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            client: null,
            posts: null,
            loadingMorePosts: false
        }

        this.feedSubscription = null;
        this.canFetchMore = true;
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
                query($commentsLimit: Int, $limitPosts: Int) {
                    user {
                        id,
                        name,
                        login,
                        email,
                        avatar,
                        registeredByExternal,
                        feed(limit: $limitPosts) {
                            id,
                            likesInt,
                            isLiked,
                            inBookmarks,
                            time,
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
                commentsLimit: postCommentsLimit,
                limitPosts: postsLimit
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
                subscription($commentsLimit: Int) {
                    listenForFeed {
                        id,
                        likesInt,
                        isLiked,
                        time,
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
                commentsLimit: postCommentsLimit
            }
        }).subscribe({
            next: (({ data: { listenForFeed: a } }) => {
                if(!a) return;

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

    loadMorePosts = () => {
        if(!this.canFetchMore || this.state.loadingMorePosts || !this.state.posts) return;

        this.setState(() => ({
            loadingMorePosts: true
        }));

        client.query({
            query: gql`
                query($commentsLimit: Int, $limitPosts: Int, $postsCursor: ID) {
                    user {
                        id,
                        feed(limit: $limitPosts, cursorID: $postsCursor) {
                            id,
                            likesInt,
                            isLiked,
                            inBookmarks,
                            text,
                            time,
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
                commentsLimit: postCommentsLimit,
                limitPosts: postsLimit,
                postsCursor: this.state.posts.slice(-1)[0].id
            },
            fetchPolicy: 'no-cache'
        }).then(({ data: { user: a } }) => {
            this.setState(() => ({
                loadingMorePosts: false
            }));

            if(!a) return this.props.castError("Something went wrong. Please, try again.");

            this.canFetchMore = a.feed.length >= postsLimit;

            this.setState(({ posts }) => ({
                posts: [
                    ...posts,
                    ...a.feed
                ]
            }), this.subscribeToFeed);
        }).catch(console.error);
    }

    render() {
        return(
            <div className="rn rn-feed" onScroll={({ target }) => {
                if(target.scrollTop + target.offsetHeight > target.scrollHeight - 15) 
                    this.loadMorePosts();
            }}>
                <Feed
                    feed={ this.state.posts }
                    onRequestPosts={ this.loadMorePosts }
                    isLoadingMore={ this.state.loadingMorePosts }
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
)(FeedPage);
