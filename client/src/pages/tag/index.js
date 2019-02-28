import React, { Component } from 'react';
import './main.css';

import { gql } from 'apollo-boost';

import client from '../../apollo';
import links from '../../links';

import Post from '../__forall__/post.preview';

import placeholderINST from '../__forall__/placeholderINST.gif';
import loadingSpinner from '../__forall__/loadingico.gif';

class Tag extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            tagData: null,
            tagName: null
        }
    }

    componentDidMount() {
        this.setState(() => ({
            tagName: this.props.match.params.tag
        }), this.loadPosts);
    }

    loadPosts = () => {
        client.query({
            query: gql`
                query($name: String!) {
                    getHashtag(name: $name) {
                        id,
                        postsInt,
                        isFollowing,
                        posts {
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
                name: this.state.tagName
            }
        }).then(({ data: { getHashtag } }) => {
            if(!getHashtag) return this.props.history.push(links["FEED_PAGE"].absolute);

            this.setState(() => ({
                isLoading: false,
                tagData: getHashtag
            }));
        }).catch(console.error);
    }

    followTag = () => {
        if(this.followingTag || !this.state.tagData) return;
        this.followingTag = true;

        this.setState(({ tagData: a }) => ({
            tagData: {
                ...a,
                isFollowing: !a.isFollowing
            }
        }));

        client.mutate({
            mutation: gql`
                mutation($tagID: ID!) {
                    followTag(tagID: $tagID)
                }
            `,
            variables: {
                tagID: this.state.tagData.id
            }
        }).then(({ data: { followTag } }) => {
            this.followingTag = false;
            if(followTag === null) return this.props.castError("Something went wrong while we tried to subscribe you to this tag. Please, try later.");

            this.setState(({ tagData: a }) => ({
                tagData: {
                    ...a,
                    isFollowing: followTag
                }
            }));
        })
    }

    render() {
        return(
            <div className="rn rn-tag">
                <div className="rn-tag-content">
                    <header className="rn-tag-header">
                        <section className="rn-tag-header-hashtag">
                            {
                                (!this.state.isLoading) ? (
                                    <span>#</span>
                                ) : (
                                    <img
                                        src={ placeholderINST }
                                        alt="loading hashtag page placeholder"
                                        className="glei-placeholder avatar parent"
                                    />
                                )
                            }
                        </section>
                        <section className="rn-tag-header-info">
                            <span className="rn-tag-header-info-name">#{ this.state.tagName }</span>
                            <div className="rn-tag-header-info-posts">
                                {
                                    (!this.state.isLoading) ? (
                                        <span className="value">{ this.state.tagData.postsInt }</span>
                                    ) : (
                                        <img
                                            src={ placeholderINST }
                                            alt="placeholder value"
                                            className="glei-placeholder text one2"
                                        />
                                    )
                                }
                                <span>post{ (this.state.tagData && this.state.tagData.postsInt !== 1) ? "s" : "" }</span>
                            </div>
                            {
                                (!this.state.isLoading) ? (
                                    <button className="rn-tag-header-info-follow definp" onClick={ this.followTag }>
                                        { (!this.state.tagData.isFollowing) ? "Follow" : "Following" }
                                    </button>
                                ) : (
                                    <img
                                        src={ placeholderINST }
                                        alt="placeholder follow button"
                                        className="glei-placeholder text value one3 margin prevent ts"
                                    />
                                )
                            }
                        </section>
                    </header>
                    <section className="rn-tag-posts">
                        <span className="rn-tag-posts-marker">Recent posts</span>
                        {
                            (!this.state.isLoading) ? (
                                <div className="rn-tag-posts-grid">
                                    {
                                        this.state.tagData.posts.map(({ id: a, isMultimedia: b, likesInt: c, commentsInt: d, preview: e }) => (
                                            <Post
                                                key={ a }
                                                id={ a }
                                                isMultimedia={ b }
                                                likesInt={ c }
                                                commentsInt={ d } 
                                                preview={ e } 
                                            />
                                        ))
                                    }
                                </div>
                            ) : (
                                <img
                                    src={ loadingSpinner }
                                    alt="posts loading spinner"
                                    className="glei-lspinner"
                                />
                            )
                        }
                    </section>
                </div>
            </div>
        );
    }
}

export default Tag;