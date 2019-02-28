import React, { Component } from 'react';
import './main.css';

import client from '../../apollo';

import { gql } from 'apollo-boost';
import { connect } from 'react-redux';

import Post from '../__forall__/post.preview';

import loadingSpinner from '../__forall__/loadingico.gif'

class ExploreGrid extends Component {
    render() {
        return(
            <div className="rn-explore-search-grid">
                {
                    this.props.posts.map(({ id: a, isMultimedia: b, likesInt: c, commentsInt: d, preview: e }) => (
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
        );
    }
}

class Explore extends Component {
    constructor(props) {
        super(props);

        this.state = {
            posts: null,
            isLoading: true
        }
    }

    componentDidMount() {
        this.fetchAPI();
    }

    fetchAPI = () => {
        client.query({
            query: gql`
                query {
                    explorePosts {
                        id,
                        isMultimedia,
                        likesInt,
                        commentsInt,
                        preview {
                            id,
                            type,
                            url
                        }
                    }
                }
            `
        }).then(({ data: { explorePosts } }) => {
            if(!explorePosts) return this.props.castError("Something went wrong.");

            this.setState(() => ({
                posts: explorePosts,
                isLoading: false
            }));
        }).catch(console.error);
    }

    render() {
        return(
            <div className="rn rn-explore">
                {
                    (this.state.isLoading) ? (
                        <img src={ loadingSpinner } alt="explore posts loading spinner" className="glei-lspinner" />
                    ) : (
                        <ExploreGrid
                            posts={ this.state.posts }
                        />
                    )
                }
            </div>
        );
    }
}

const mapStateToProps = () => ({});

const mapActionsToProps = {
    castError: text => ({ type: 'CAST_GLOBAL_ERROR', payload: { text } })
}

export default connect(
    mapStateToProps,
    mapActionsToProps
)(Explore);
