import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import './main.css';

import { connect } from 'react-redux';
import { gql } from 'apollo-boost';

import api from '../../../api';
import client from '../../../apollo';

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

class PostCarouselVideo extends PureComponent {
    constructor(props) {
        super(props);

        this.matRef = React.createRef();
    }

    toggleVideo = () => {
        const a = this.matRef;

        if(!a.paused) a.pause();
        else a.play();

        this.forceUpdate(); // Update icon
    }

    render() {
        return(
            <div className="gle-post-carousel-image video" onClick={ this.toggleVideo }>
                <button className={ `gle-post-carousel-image-videotogg definp${ (!this.props.hideControls) ? "" : " hide" }` }>
                    <FontAwesomeIcon icon={ (!this.matRef.paused) ? faPlaySolid : faPauseSolid } />
                </button>
                <video autoPlay muted loop paused={ true } ref={ ref => this.matRef = ref }>
                    <source src={ this.props.url } type="video/mp4" />
                    Please, update your browser.
                </video>
            </div>
        );
    }
}

PostCarouselVideo.propTypes = {
    url: PropTypes.string.isRequired
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
                        this.props.media.map(({ id, url, type }, index) => (
                            (type === "image") ? (
                                <img
                                    key={ id }
                                    className={
                                        `gle-post-carousel-image${ (this.state.position > index) ? " old" : (this.state.position < index) ? " new" : " current" }`
                                    }
                                    alt="target"
                                    src={ api.storage + url }
                                />
                            ) : (type === "video") ? (
                                <PostCarouselVideo
                                    url={ api.storage + url }
                                    hideControls={ this.state.likeAnimation }
                                />
                            ) : null // Fatal error
                        ))
                    }
                </div>
                <div className="gle-post-carousel-path">
                    <div className="gle-post-carousel-path-mat">
                        {
                            Array(this.props.media.length).fill(null).map((_, index) => (
                                <button key={ index } className={ `gle-post-carousel-path-btn definp${ (this.state.position !== index) ? "" : " active" }` } />
                            ))
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
        return(
            <div className="gle-post-comments">
                {
                    (this.props.comments.length) ? (
                        <button className="gle-post-comments-lmore definp">
                            Load more comments
                        </button>
                    ) : null
                }
                {
                    this.props.comments.map(({ id, creator, content, isLiked }) => (
                        <PostCommentItem
                            key={ id }
                            id={ id }
                            authID={ creator.id }
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

class Post extends Component {
    constructor(props) {
        super(props);

        this.state = {
            likesInt: null,
            isLiked: null,
            inBookmarks: null,
            comments: null
        }

        this.likeProcessing = this.pushingBookmark = false;
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
            <p className="gle-post-auth-desc">
                {
                    (places.length) ? (
                        <>
                            In
                            {
                                places.map((session, index) => {
                                    const a = !!places[index + 1];

                                    // mm - minimal margin :)
                                    return(
                                        <span className={ (a) ? "mm" : "" } key={ index }>Ukraine, Lviv{ (a) ? ", " : "" }</span>
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
                                        <button className={ `definp${ (a) ? " mm" : "" }` } key={ index }>Oles Odynets{ (a) ? ", " : "" }</button>
                                    );
                                })
                            }
                        </>
                    ) : <></>
                }
            </p>
        );
    }

    render() {
        return(
            <article className="gle-post">
                <section className="gle-post-auth">
                    <div className="gle-post-auth-avatar">
                        <img src={ api.storage + this.props.aavatar } alt="post author" />
                    </div>
                    <div className="gle-post-auth-info">
                        <span className="gle-post-auth-name">{ this.props.aname }</span>
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
                <PostCommentItem
                    content={ this.props.text }
                    name={ this.props.aname }
                    canLike={ false }
                />
                <PostComments
                    postID={ this.props.id }
                    comments={ this.state.comments || this.props.comments }
                />
                <CommentInput
                    onRef={ ref => this.commentInputRef = ref }
                    onSubmit={ this.postComment }
                    callMenu={() => this.props.callGlobalMenu({
                        type: "OPTIONS",
                        buttons: [
                            {
                                isRed: true,
                                action: () => null,
                                text: "Unfollow author",
                                close: true
                            },
                            {
                                isRed: false,
                                action: () => null,
                                text: "Go to post",
                                close: true
                            },
                            {
                                isRed: false,
                                action: () => null,
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
    aid: PropTypes.string.isRequired,
    aname: PropTypes.string.isRequired,
    aavatar: PropTypes.string.isRequired,
    comments: PropTypes.array.isRequired,
    media: PropTypes.array.isRequired,
    isLiked: PropTypes.bool.isRequired,
    text: PropTypes.string.isRequired,
    places: PropTypes.array,
    people: PropTypes.array
}

const mapStateToProps = () => ({});

const mapActionsToProps = {
    callGlobalMenu: payload => ({ type: 'SET_GLOBAL_MENU', payload }),
    castError: text => ({ type: "CAST_GLOBAL_ERROR", payload: { text } })
}

export default connect(
    mapStateToProps,
    mapActionsToProps
)(Post);
