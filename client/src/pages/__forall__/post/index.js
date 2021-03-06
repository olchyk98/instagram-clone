import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './main.css';

import { connect } from 'react-redux';
import { gql } from 'apollo-boost';
import { Link, withRouter } from 'react-router-dom';

import api from '../../../api';
import client from '../../../apollo';
import links from '../../../links';
import { convertTime } from '../../../utils';

import PostCommentItem from '../post.comment';
import CommentInput from '../post.commentinput';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faChevronLeft as faChevronLeftSolid,
    faChevronRight as faChevronRightSolid,
    faHeart as faHeartSolid,
    faBookmark as faBookmarkSolid,
    faPlay as faPlaySolid,
    faPause as faPauseSolid
} from '@fortawesome/free-solid-svg-icons';
import {
    faHeart as faHeartRegular,
    faComment as faCommentRegular,
    faBookmark as faBookmarkRegular
} from '@fortawesome/free-regular-svg-icons';

import loadingSpinner from '../loadingico.gif';

const commentsLimit = 7;

class PostCarouselVideo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isRunning: !props.isFirst
        }

        this.matRef = React.createRef();
    }

    componentDidUpdate() {
        if(this.state.isRunning && this.props.status === "current") {
            this.matRef.play();
        } else {
            this.matRef.pause();
        }
    }


    toggleVideo = () => this.setState(({ isRunning: a }) => ({
        isRunning: !a
    }));

    render() {
        return(
            <div className={ `gle-post-carousel-image video ${ this.props.status }` } onClick={ this.toggleVideo }>
                <button className={ `gle-post-carousel-image-videotogg definp${ (!this.props.hideControls) ? "" : " hide" }` }>
                    <FontAwesomeIcon icon={ (this.state.isRunning) ? faPlaySolid : faPauseSolid } />
                </button>
                <video muted loop ref={ ref => this.matRef = ref }>
                    <source src={ this.props.url } type="video/mp4" />
                    Please, update your browser.
                </video>
            </div>
        );
    }
}

PostCarouselVideo.propTypes = {
    url: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    isFirst: PropTypes.bool
}

class PostCarousel extends Component {
    constructor(props) {
        super(props);

        this.state = {
            position: 0,
            likeAnimation: false
        }
    }

    moveCarousel = dir => this.setState(({ position }, { media }) => ({
        position: (media[position + dir]) ? position + dir : position
    }));

    render() {
        return(
            <section className="gle-post-carousel">
                <div className="gle-post-carousel-target" onDoubleClick={() => {
                    if(this.props.media[this.state.position].type === "video") return;

                    this.setState({ likeAnimation: true });
                    if(!this.props.isLiked) this.props.likePost();
                }}>
                    <div
                        // WARNING: Only one animation allowed
                        className="gle-post-carousel-target-likeamico"
                        {
                            // Hmm.. It works, but I'm not sure it is correct.
                            ...( (!this.state.likeAnimation) ? null : { amrun: "true" } )
                        }
                        onAnimationEnd={ () => this.setState({ likeAnimation: false }) }>
                        <FontAwesomeIcon icon={ faHeartSolid } />
                    </div>
                    <div />
                    {
                        (this.props.media[this.state.position - 1]) ? (
                            <button
                                className="gle-post-carousel-controls-btn l definp"
                                onClick={ () => this.moveCarousel(-1) }>
                                <FontAwesomeIcon icon={ faChevronLeftSolid } />
                            </button>
                        ) : <div />
                    }
                    {
                        (this.props.media[this.state.position + 1]) ? (
                            <button
                                className="gle-post-carousel-controls-btn r definp"
                                onClick={ () => this.moveCarousel(1) }>
                                <FontAwesomeIcon icon={ faChevronRightSolid } />
                            </button>
                        ) : <div />
                    }
                    {
                        this.props.media.map(({ id, url, type }, index) => {
                            const status = (this.state.position > index) ? "old" : (this.state.position < index) ? "new" : "current";

                            if(type === "image") {
                                return(
                                    <img
                                        key={ id }
                                        className={ "gle-post-carousel-image " + status }
                                        alt="target"
                                        src={ api.storage + url }
                                    />
                                );
                            } else if(type === "video") {
                                return(
                                    <PostCarouselVideo
                                        key={ id }
                                        isFirst={ index === 0 }
                                        url={ api.storage + url }
                                        hideControls={ this.state.likeAnimation }
                                        status={ status }
                                    />
                                );
                            } else {
                                console.error("Invalid post media type.");
                                console.error("FATAL ERROR. Please commit an issue here: https://github.com/olchyk98/instagram-clone.");
                                alert("FATAL ERROR. CHECK THE CONSOLE");
                                return null;
                            }
                        })
                    }
                </div>
                <div className="gle-post-carousel-path">
                    <div className="gle-post-carousel-path-mat">
                        {
                            (this.props.media.length > 1) ? (
                                Array(this.props.media.length).fill(null).map((_, index) => (
                                    <button key={ index } className={ `gle-post-carousel-path-btn definp${ (this.state.position !== index) ? "" : " active" }` } />
                                ))
                            ) : null
                        }
                    </div>
                    <div className="gle-port-carousel-feedback">
                        <div>
                            <button className={ `gle-port-carousel-feedback-btn definp${ (!this.props.isLiked) ? "" : " liked" }` } onClick={ this.props.likePost }>
                                <FontAwesomeIcon icon={ (!this.props.isLiked) ? faHeartRegular : faHeartSolid } />
                            </button>
                            <button className="gle-port-carousel-feedback-btn definp" onClick={ this.props.focusCommentInput }>
                                <FontAwesomeIcon icon={ faCommentRegular } />
                            </button>
                        </div>
                        <div>
                            <button className="gle-port-carousel-feedback-btn definp" onClick={ this.props.pushBookmark }>
                                <FontAwesomeIcon icon={ (!this.props.inBookmarks) ? faBookmarkRegular : faBookmarkSolid } />
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

PostCarousel.propTypes = {
    isLiked: PropTypes.bool.isRequired,
    likePost: PropTypes.func.isRequired,
    media: PropTypes.array.isRequired
}

class PostComments extends Component {
    render() {
        if(!this.props.comments.length) return null;

        return(
            <div className="gle-post-comments">
                {
                    (this.props.canLoadComments) ? (
                        <button className="gle-post-comments-lmore definp" onClick={ this.props.onMore }>
                            Load more comments
                        </button>
                    ) : null
                }
                {
                    (!this.props.loadingMore) ? null : (
                        <img
                            alt="loading more comments spinner"
                            className="glei-lspinner margintb"
                            src={ loadingSpinner }
                        />    
                    )
                }
                {
                    this.props.comments.map(({ id, creator, content, isLiked }) => (
                        <PostCommentItem
                            key={ id }
                            id={ id }
                            authID={ creator.id }
                            login={ creator.login }
                            name={ creator.getName }
                            content={ content }
                            isLiked={ isLiked }
                        />
                    ))
                }
            </div>
        );
    }
}

PostComments.propTypes = {
    comments: PropTypes.array.isRequired,
    canLoadComments: PropTypes.bool,
    loadingMore: PropTypes.bool
}

class Post extends Component {
    constructor(props) {
        super(props);

        this.state = {
            likesInt: null,
            isLiked: null,
            inBookmarks: null,
            comments: null,
            loadingComments: false,
            canLoadComments: true
        }

        this.likeProcessing =
        this.pushingBookmark = false;
        this.commentInputRef = React.createRef();
    }

    likePost = () => {
        if(this.likeProcessing) return;
        this.likeProcessing = true;

        this.setState(({ likesInt: a, isLiked: b }, { likesInt: c, isLiked: d }) => ({
            likesInt: (a === null) ? (!d) ? c + 1 : c - 1 : (!b) ? a + 1 : c - 1,
            isLiked: (b === null) ? !d : !b
        }));

        client.mutate({
            mutation: gql`
                mutation($postID: ID!) {
                    likePost(postID: $postID) {
                        id,
                        isLiked,
                        likesInt
                    }
                }
            `,
            variables: {
                postID: this.props.id
            }
        }).then(({ data: { likePost } }) => {
            this.likeProcessing = false;
            if(likePost === null) return this.props.castError("An error occured while tried to submit your like. Please, try again.");

            this.setState(() => ({
                likesInt: likePost.likesInt,
                isLiked: likePost.isLiked
            }));
        }).catch(console.error);
    }

    pushBookmark = () => {
        if(this.pushingBookmark) return;
        this.pushingBookmark = true;

        this.setState(({ inBookmarks: a }, { inBookmarks: b }) => ({
            inBookmarks: (a === null) ? !b : !a
        }));

        client.mutate({
            mutation: gql`
                mutation($postID: ID!) {
                    pushBookmark(postID: $postID)
                }
            `,
            variables: {
                postID: this.props.id
            }
        }).then(({ data: { pushBookmark } }) => {
            this.pushingBookmark = false;
            if(pushBookmark === null) return this.props.castError("An error occured while tried to submit your like. Please, try again.");

            this.setState(() => ({
                inBookmarks: pushBookmark
            }))
        }).catch(console.error);
    }

    postComment = content => {
        {
            const _a = this.state.comments;
            var a_id = this.props.comments.length + ((_a) ? _a.length : 0);

            const a = {
                id: a_id,
                creator: {
                    id: 0,
                    login: null,
                    getName: "YOU"
                },
                isLiked: false,
                content
            }

            this.setState(({ comments: _a }, { comments: _b }) => ({
                comments: (_a === null) ? ([
                    ..._b,
                    a
                ]) : ([
                    ..._a,
                    a
                ])
            }));
        }

        client.mutate({
            mutation: gql`
                mutation($postID: ID!, $content: String!) {
                    commentPost(postID: $postID, content: $content) {
                        id,
                        creator {
                            id,
                            login,
                            getName
                        },
                        isLiked,
                        content
                    }
                }
            `,
            variables: {
                postID: this.props.id,
                content
            }
        }).then(({ data: { commentPost } }) => {
            if(!commentPost) return this.props.castError("Something went wrong. Please, try again.");

            const a = this.state.comments;
            a[a.findIndex(io => io.id === a_id)] = commentPost;

            this.setState(() => ({
                comments: a
            }), () => this.forceUpdate());
        });
    }

    getEDescription(places, people) {
        return(
            <div className="gle-post-auth-desc">
                {
                    (places.length) ? (
                        <>
                            In
                            {
                                places.map((session, index) => {
                                    const a = !!places[index + 1];

                                    // mm - minimal margin :)
                                    return(
                                        <span className={ (a) ? "mm" : "" } key={ index }>{ session }{ (a) ? ", " : "" }</span>
                                    );
                                })
                            }
                        </>
                    ) : <></>
                }
                {
                    (people.length) ? (
                        <>
                            {
                                (places.length) ? "with" : "With"
                            }
                            {
                                people.map((session, index) => {
                                    const a = !!people[index + 1];

                                    return(
                                        <Link to={ `${ links["ACCOUNT_PAGE"].absolute }/${ session.login }` } className={ `definp${ (a) ? " mm" : "" }` } key={ index }>{ session.getName }{ (a) ? ", " : "" }</Link>
                                    );
                                })
                            }
                        </>
                    ) : <></>
                }
            </div>
        );
    }

    loadMoreComments = () => {
        if(!this.state.canLoadComments || this.state.loadingComments) return;

        this.setState(() => ({
            loadingComments: true
        }));

        client.query({
            query: gql`
                query($targetID: ID!, $limit: Int, $cursorID: ID) {
                    post(targetID: $targetID) {
                        id,
                        comments(limit: $limit, cursorID: $cursorID) {
                            id,
                            creator {
                                id,
                                login,
                                getName
                            },
                            isLiked,
                            content
                        }
                    }
                }
            `,
            variables: {
                targetID: this.props.id,
                limit: commentsLimit,
                cursorID: (this.state.comments && this.state.comments[0].id) || this.props.comments[0].id
            }
        }).then(({ data: { post: a } }) => {
            if(!a) return this.props.castError("Something went wrong");

            const comments = Array.from(a.comments);

            this.setState(({ comments: b }, { comments: c }) => ({
                comments: (b === null) ? [
                    ...comments,
                    ...c
                ] : [
                    ...comments,
                    ...b
                ],
                canLoadComments: a.comments.length >= commentsLimit,
                loadingComments: false
            }));
        }).catch(console.error);
    }

    render() {
        return(
            <article className="gle-post">
                <section className="gle-post-auth">
                    <Link className="gle-post-auth-avatar" to={ `${ links["ACCOUNT_PAGE"].absolute }/${ this.props.alogin }` }>
                        <img src={ api.storage + this.props.aavatar } alt="post author" />
                    </Link>
                    <div className="gle-post-auth-info">
                        <Link className="gle-post-auth-name" to={ `${ links["ACCOUNT_PAGE"].absolute }/${ this.props.alogin }` }>
                            { this.props.aname }
                        </Link>
                        { this.getEDescription(this.props.places, this.props.people) }
                    </div>
                </section>
                <PostCarousel
                    media={ this.props.media || [] }
                    isLiked={ (this.state.isLiked === null) ? this.props.isLiked : this.state.isLiked }
                    inBookmarks={ (this.state.inBookmarks === null) ? this.props.inBookmarks : this.state.inBookmarks }
                    likePost={ this.likePost }
                    pushBookmark={ this.pushBookmark }
                    focusCommentInput={ () => this.commentInputRef.focus() }
                />
                <span className="gle-post-stricts">{ (this.state.likesInt === null) ? this.props.likesInt : this.state.likesInt } likes</span>
                {
                    (this.props.text) ? (
                        <PostCommentItem
                            content={ this.props.text }
                            checkTags={ true }
                            login={ this.props.alogin }
                            name={ this.props.aname }
                            canLike={ false }
                        />
                    ) : null
                }
                <PostComments
                    postID={ this.props.id }
                    comments={ this.state.comments || this.props.comments }
                    onMore={ this.loadMoreComments }
                    canLoadComments={ this.state.canLoadComments }
                    loadingMore={ this.state.loadingComments }
                />
                <span className="gle-post-time">{ convertTime(this.props.time, "ago") }</span>
                <CommentInput
                    onRef={ ref => this.commentInputRef = ref }
                    onSubmit={ this.postComment }
                    callMenu={() => this.props.callGlobalMenu({
                        type: "OPTIONS",
                        buttons: [
                            {
                                isRed: false,
                                action: () => this.props.history.push(`${ links["POST_PAGE"].absolute }/${ this.props.id }`),
                                text: "Go to post",
                                close: true
                            },
                            {
                                isRed: false,
                                action: () => {
                                    navigator.clipboard.writeText(`${ window.location.host }${ links["POST_PAGE"].absolute }/${ this.props.id }`);
                                },
                                text: "Copy link",
                                close: true
                            },
                            {
                                isRed: false,
                                action: () => this.props.callGlobalMenu(null),
                                text: "Cancel"
                            }
                        ]
                    })}
                />
            </article>
        );
    }
}

Post.propTypes = {
    id: PropTypes.string.isRequired,
    likesInt: PropTypes.number.isRequired,
    aid: PropTypes.string.isRequired, // author id
    alogin: PropTypes.string.isRequired,
    aname: PropTypes.string.isRequired, // author name
    aavatar: PropTypes.string.isRequired, // author avatar
    comments: PropTypes.array.isRequired,
    media: PropTypes.array.isRequired,
    isLiked: PropTypes.bool.isRequired,
    text: PropTypes.string.isRequired,
    places: PropTypes.array,
    people: PropTypes.array,
    time: PropTypes.string.isRequired
}

const mapStateToProps = () => ({});

const mapActionsToProps = {
    callGlobalMenu: payload => ({ type: 'SET_GLOBAL_MENU', payload }),
    castError: text => ({ type: "CAST_GLOBAL_ERROR", payload: { text } })
}

export default connect(
    mapStateToProps,
    mapActionsToProps
)(withRouter(Post));
