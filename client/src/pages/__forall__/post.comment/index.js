import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './main.css';

import { gql } from 'apollo-boost';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import client from '../../../apollo';
import links from '../../../links';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';

class Comment extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLiked: null
        }

        this.likeProcess = null;
    }

    static defaultProps = {
        canLike: true
    }

    likeComment = () => {
        if(this.likeProcess || !this.props.canLike) return;
        this.likeProcess = true;

        this.setState(({ isLiked: a }, { isLiked: b }) => ({
            isLiked: (a === null) ? !b : !a
        }));

        client.mutate({
            mutation: gql`
                mutation($commentID: ID!) {
                    likeComment(commentID: $commentID)
                }
            `,
            variables: {
                commentID: this.props.id
            }
        }).then(({ data: { likeComment } }) => {
            this.likeProcess = false;
            if(likeComment === null) return this.props.castError("Something went wrong");

            this.setState(() => ({
                isLiked: likeComment
            }));
        }).catch(console.error);
    }

    render() {
        const isLiked = !((this.state.isLiked === null && !this.props.isLiked) || this.state.isLiked === false);

        return(
            <article className="gle-post-commentitem">
                <div className="gle-post-commentitem-content">
                    <Link className="gle-post-commentitem-content-name" onClick={ this.props.closeFloatPhoto } to={ (this.props.login) ? `${ links["ACCOUNT_PAGE"].absolute }/${ this.props.login }` : "" }>
                        { this.props.name }
                    </Link>
                    <span className="gle-post-commentitem-content-mat">
                        {
                            (!this.props.checkTags) ? (
                                this.props.content
                            ) : ( //
                                this.props.content
                                .split(" ").map((session, index) => {
                                    if(!session.match(/#[A-z|-]+/g)) {
                                        return <span key={ index }>{ session }</span>;
                                    } else {
                                        return(
                                            <Link
                                                key={ index }
                                                onClick={ this.props.closeFloatPhoto }
                                                to={ `${ links["TAG_PAGE"].absolute }/${ session.replace("#", "") }` }
                                                className="link">
                                                { session }
                                            </Link>
                                        );
                                    }
                                })
                            )
                        }
                    </span>
                </div>
                {
                    (this.props.canLike) ? (
                        <button className={ `gle-post-commentitem-like definp${ (!isLiked) ? "" : " liked" }` } onClick={ this.likeComment }>
                            <FontAwesomeIcon icon={ (!isLiked) ? faHeartRegular : faHeartSolid } />
                        </button>
                    ) : null
                }
            </article>
        );
    }
}

Comment.propTypes = {
    content: PropTypes.string.isRequired,
    login: PropTypes.string,
    name: PropTypes.string.isRequired,
    canLike: PropTypes.bool,
    id: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number // client applies INDEX_NUMBER id a new comment when the original item fetches.
    ]),
    isLiked: PropTypes.bool,
    checkTags: PropTypes.bool
}

const mapStateToProps = () => ({});

const mapActionsToProps = {
    castError: text => ({ type: 'CAST_GLOBAL_ERROR', payload: { text } }),
    closeFloatPhoto: () => ({ type: 'PREVIEW_FLOAT_MODAL', payload: null })
}

export default connect(
    mapStateToProps,
    mapActionsToProps
)(Comment);
