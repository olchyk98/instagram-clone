import React, { Component } from 'react';
import './main.css';

import { gql } from 'apollo-boost';
import { connect } from 'react-redux';
import api from '../../api';

import client from '../../apollo';

import Post from '../__forall__/post';

import placeholderIMG from '../__forall__/placeholderINST.gif';

const postCommentsLimit = 15;

class Feed extends Component {
    render() {
        return(
            <section className="rn-feed-block rn-feed-mat">
                {
                    (this.props.feed) ? (
                        this.props.feed.map(({ id, likesInt, creator, comments, media, isLiked, text, inBookmarks }, index) => (
                            <Post
                                key={ id }
                                id={ id }
                                likesInt={ likesInt }
                                text={ text }
                                aid={ creator.id }
                                aname={ creator.name }
                                aavatar={ creator.avatar }
                                comments={ comments }
                                media={ media }
                                isLiked={ isLiked }
                                inBookmarks={ inBookmarks }
                            />
                        ))
                    ) : (
                        <div className="rn-feed-mat-placeholder">
                            <img src={ placeholderIMG } alt="placeholder" className="glei-placeholder text margin l" />
                            <img src={ placeholderIMG } alt="placeholder" className="glei-placeholder text one3 margin l" />
                            <img src={ placeholderIMG } alt="placeholder" className="glei-placeholder big margin prevent ts" />
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
                        <img src={ this.props.client && api.storage + this.props.client.avatar } alt="user" />
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
                                    <img src={ placeholderIMG } alt="placeholder" className="glei-placeholder text one3" />
                                    <img src={ placeholderIMG } alt="placeholder" className="glei-placeholder text one3" />
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
    }

    componentDidMount() {
        this.fetchMain();
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
                        registeredByFacebook,
                        feed {
                            id,
                            likesInt,
                            isLiked,
                            inBookmarks,
                            text,
                            media {
                                id,
                                url,
                                type
                            },
                            creator {
                                id,
                                name,
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
            fetchPolicity: 'no-cache'
        }).then(({ data: { user } }) => {
            if(!user) return this.props.castError("Something went wrong");

            this.setState(() => ({
                client: {
                    id: user.id,
                    name: user.name,
                    login: user.login,
                    avatar: user.avatar,
                    rbfb: user.registeredByFacebook,
                    email: user.email
                },
                posts: user.feed
            }))
        }).catch(console.error);
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
