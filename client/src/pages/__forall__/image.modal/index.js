import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './main.css';

import verification_image from '../images/verification.png';

import client from '../../../apollo';
import api from '../../../api';
import { cookieControl, convertTime } from '../../../utils';
import links from '../../../links';

import { connect } from 'react-redux';
import { gql } from 'apollo-boost';
import { Link } from 'react-router-dom';

import Comment from '../post.comment';
import CommentInput from '../post.commentinput';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faHeart as faHeartRegular,
    faComment as faCommentRegular,
    faBookmark as faBookmarkRegular
} from '@fortawesome/free-regular-svg-icons';
import {
    faHeart as faHeartSolid,
    faBookmark as faBookmarkSolid,
    faArrowLeft as faArrowLeftSolid,
    faArrowRight as faArrowRightSolid,
    faPause as faPauseSolid,
    faPlay as faPlaySolid,
} from '@fortawesome/free-solid-svg-icons';

import placeholderINST from '../placeholderINST.gif';
import loadingSpinner from '../loadingico.gif';

const commentsLimit = 15;

class Media extends Component {
    constructor(props) {
        super(props);

        if(this.props.type !== "image") {
            this.state = {
                isPlaying: true
            }

            this.videoRef = React.createRef();
        }
    }

    componentDidUpdate() {
        if(this.props.type === "video" && this.videoRef) {
            this.videoRef[(this.props.status === "current" && this.state.isPlaying) ? "play" : "pause"]();
        }
    }

    render() {
        return(
            <section className={ `gle-imagemodal-mat-image-item ${ (this.props.status) }` }>
                {
                    (this.props.type === "image") ? (
                        <img onLoad={ this.props.onMediaLoaded } src={ this.props.url } alt="target" />
                    ) : ( // video
                        <>
                            <button
                                className="gle-imagemodal-mat-image-item-vtoggle definp"
                                onClick={ () => this.setState(({ isPlaying: a }) => ({ isPlaying: !a })) }>
                                <FontAwesomeIcon icon={ (this.state.isPlaying) ? faPlaySolid : faPauseSolid } />
                            </button>
                            <video onLoadedData={ this.props.onMediaLoaded } muted loop ref={ ref => this.videoRef = ref }>
                                <source src={ this.props.url } type="video/mp4" />
                                Please, update your browser.
                            </video>
                        </>
                    )
                }
            </section>
        );
    }
}

Media.propTypes = {
    type: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    onMediaLoaded: PropTypes.func
}

class Hero extends Component {
    constructor(props) {
        super(props);

        this.state = {
            photo: null,
            active: false,
            isLoading: true,
            submittingComment: false,
            followingCreator: false,
            carouselIndex: 0,
            canLoadComments: true,
            loadingMoreComments: false
        }

        this.viewRef = React.createRef();
        this.commentInputRef = React.createRef();
        this.commentsBlockRef = React.createRef();
        this.clientID = null;
        this.likeProcessing =
        this.bookmarkProcessing = false;
    }

    componentDidMount() {
        this.clientID = cookieControl.get("userid");
        this.forceUpdate();
    }

    componentDidUpdate(prevProps, prevState) {
        if(
            (!prevProps && this.props) ||
            (prevProps && prevProps.activeData !== this.props.activeData) ||
            typeof prevProps.activeData !== typeof this.props.activeData ||
            (
                prevProps.activeData && this.props.activeData &&
                this.props.activeData.id !== prevProps.activeData.id
            )
        ) { // UPDATED
            if(this.props.activeData) {
                this.setState(() => ({
                    active: true,
                    isLoading: true,
                    carouselIndex: 0,
                    directURL: ""
                }), () => this.fetchPhoto(this.props.activeData.id));
            } else {
                this.setState(() => ({
                    active: false,
                    isLoading: true,
                    carouselIndex: 0,
                    directURL: ""
                }));
            }
        }
    }

    fetchPhoto = targetID => {
        client.query({
            query: gql`
                query($targetID: ID!, $limitComments: Int) {
                    post(targetID: $targetID) {
                        id,
                        text,
                        places,
                        people {
                            id,
                            getName,
                            login
                        },
                        media {
                            id,
                            url,
                            type
                        },
                        creator {
                            id,
                            login,
                            getName,
                            avatar,
                            isVerified,
                            isFollowing
                        },
                        comments(limit: $limitComments) {
                            id,
                            content,
                            isLiked,
                            creator {
                                id,
                                getName,
                                login
                            }
                        },
                        likesInt,
                        isLiked,
                        inBookmarks,
                        time
                    }
                }
            `,
            variables: {
                targetID,
                limitComments: commentsLimit
            }
        }).then(({ data: { post } }) => {
            if(!post) return this.props.castError("We couldn't load this post. Please, try later.");

            this.setState(() => ({
                photo: post,
                canLoadComments: true,
                carouselIndex: 0,
                isLoading: false,
                directURL: links["POST_PAGE"].absolute + "/" + post.id
            }), () => {
                window.history.pushState(null, null, this.state.directURL);
            });
        }).catch(console.error);
    }

    likePost = () => {
        if(this.likeProcessing || !this.state.photo) return;
        this.likeProcessing = true;

        this.setState(({ photo, photo: { isLiked: a, likesInt: b } }) => ({
            photo: {
                ...photo,
                isLiked: !a,
                likesInt: (!a) ? b + 1 : b - 1
            }
        }));

        client.mutate({
            mutation: gql`
                mutation($postID: ID!) {
                    likePost(postID: $postID) {
                        isLiked,
                        likesInt
                    }
                }
            `,
            variables: {
                postID: this.state.photo.id
            }
        }).then(({ data: { likePost } }) => {
            this.likeProcessing = false;
            if(!likePost) {
                this.setState(({ photo, photo: { isLiked: a, likesInt: b } }) => ({
                    photo: {
                        ...photo,
                        isLiked: !a,
                        likesInt: (!a) ? b + 1 : b - 1
                    }
                }));
                return this.props.castError("We couldn't submit your like...");
            }

            this.setState(({ photo }) => ({
                photo: {
                    ...photo,
                    likesInt: likePost.likesInt,
                    isLiked: likePost.isLiked
                }
            }))
        }).catch(console.error);
    }

    addToBookmarks = () => {
        if(this.bookmarkProcessing || !this.state.photo) return;
        this.bookmarkProcessing = true;

        this.setState(({ photo, photo: { inBookmarks: a } }) => ({
            photo: {
                ...photo,
                inBookmarks: !a
            }
        }));

        client.mutate({
            mutation: gql`
                mutation($postID: ID!) {
                    pushBookmark(postID: $postID)
                }
            `,
            variables: {
                postID: this.state.photo.id
            }
        }).then(({ data: { pushBookmark } }) => {
            this.bookmarkProcessing = false;

            if(pushBookmark === null) {
                this.setState(({ photo, photo: { inBookmarks: a } }) => ({
                    photo: {
                        ...photo,
                        inBookmarks: !a
                    }
                }));
                return this.props.castError("We couldn't add this post to your library");
            }

            this.setState(({ photo }) => ({
                photo: {
                    ...photo,
                    inBookmarks: pushBookmark
                }
            }));
        }).catch(console.error);
    }

    commentPost = text => {
        if(this.state.submittingComment || !this.state.photo) return;

        this.setState(() => ({
            submittingComment: true
        }), () => this.commentsBlockRef.scrollTop = this.commentsBlockRef.scrollHeight);

        client.mutate({
            mutation: gql`
                mutation($postID: ID!, $content: String!) {
                    commentPost(postID: $postID, content: $content) {
                        id,
                        content,
                        isLiked,
                        creator {
                            id,
                            login,
                            getName
                        }
                    }
                }
            `,
            variables: {
                postID: this.state.photo.id,
                content: text
            }
        }).then(({ data: { commentPost } }) => {
            this.setState(() => ({
                submittingComment: false
            }));
            if(!commentPost) return this.props.castError("Whooops. Something went wrong while tried to submit your comment.");

            this.setState(({ photo, photo: { comments } }) => ({ // -.-
                photo: {
                    ...photo,
                    comments: comments.concat(commentPost)
                }
            }), () => this.commentsBlockRef.scrollTop = this.commentsBlockRef.scrollHeight);
        }).catch(console.error);
    }

    getEDescription(places, people) {
        return(
            <p className="gle-post-auth-desc mb">
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
                                        <Link onClick={ this.props.closeSelf } to={ `${ links["ACCOUNT_PAGE"].absolute }/${ session.login }` } className={ `definp${ (a) ? " mm" : "" }` } key={ index }>{ session.getName }{ (a) ? ", " : "" }</Link>
                                    );
                                })
                            }
                        </>
                    ) : <></>
                }
            </p>
        );
    }

    followCreator = () => {
        if(!this.state.photo || this.state.followingCreator) return;

        this.setState(({ photo, photo: { creator } }) => ({
            followingCreator: true,
            photo: {
                ...photo,
                creator: {
                    ...creator,
                    isFollowing: !creator.isFollowing
                }
            }
        }));

        client.mutate({
            mutation: gql`
                mutation($targetID: ID!) {
                    subscribeToUser(targetID: $targetID) {
                        id,
                        isFollowing
                    }
                }
            `,
            variables: {
                targetID: this.state.photo.creator.id
            }
        }).then(({ data: { subscribeToUser } }) => {
            this.setState(() => ({
                followingCreator: false
            }));

            if(!subscribeToUser) return this.props.castError("We could subscribe you to this user. Please, try later.");

            this.setState(({ photo, photo: { creator } }) => ({
                photo: {
                    ...photo,
                    creator: {
                        ...creator,
                        isFollowing: subscribeToUser.isFollowing
                    }
                }
            }));
        }).catch(console.error);
    }

    loadMoreComments = () => {
        if(this.state.loadingMoreComments || !this.state.canLoadComments || !this.state.photo) return;

        this.setState(() => ({
            loadingMoreComments: true
        }));

        client.query({
            query: gql`
                query($targetID: ID!, $limit: Int, $cursorID: ID) {
                    post(targetID: $targetID) {
                        id,
                        comments(limit: $limit, cursorID: $cursorID) {
                            id,
                            content,
                            isLiked,
                            creator {
                                id,
                                login,
                                getName
                            }
                        }
                    }
                }
            `,
            variables: {
                targetID: this.state.photo.id,
                limit: commentsLimit,
                cursorID: this.state.photo.comments[0].id
            }
        }).then(({ data: { post: a } }) => {
            if(!a) return this.props.castError("Oops.. we couldn't load more comments. Please, try later.")

            this.setState(({ photo, photo: { comments } }) => ({
                photo: {
                    ...photo,
                    comments: [
                        ...a.comments,
                        ...comments
                    ]
                },
                canLoadComments: a.comments.length >= commentsLimit,
                loadingMoreComments: false
            }));
        }).catch(console.error);
    }

    render() {
        return(
            <div className={ `gle-imagemodal${ (!this.state.active) ? "" : " active" }` }>
                <div
                    className="gle-imagemodal-bg"
                    onClick={() => {
                        this.props.closeSelf();
                        if(this.props.activeData.backRoute) {
                            window.history.pushState(null, null, this.props.activeData.backRoute);
                        }
                        if(this.props.activeData.onClose) this.props.activeData.onClose();
                    }}
                />
                {
                    (!this.state.isLoading) ? (
                        <div className="gle-imagemodal-mat">
                            <section className="gle-imagemodal-mat-image" ref={ ref => this.viewRef = ref }>
                                {
                                    this.state.photo.media.map(({ id, type, url }, index) => (
                                        <Media
                                            key={ id }
                                            type={ type }
                                            url={ api.storage + url }
                                            status={ (this.state.carouselIndex > index) ? "old" : (this.state.carouselIndex < index) ? "new" : "current" }
                                            onMediaLoaded={ () => this.forceUpdate() }
                                        />
                                    ))
                                }
                                {
                                    (this.state.photo.media[this.state.carouselIndex - 1] !== undefined) ? (
                                        <button
                                            className="gle-imagemodal-mat-image-scroll definp l"
                                            onClick={ () => this.setState(({ carouselIndex: a }) => ({ carouselIndex: a - 1 })) }>
                                            <FontAwesomeIcon icon={ faArrowLeftSolid } alt="icon" />
                                        </button>
                                    ) : null
                                }
                                {
                                    (this.state.photo.media[this.state.carouselIndex + 1] !== undefined) ? (
                                        <button
                                            className="gle-imagemodal-mat-image-scroll definp r"
                                            onClick={ () => this.setState(({ carouselIndex: a }) => ({ carouselIndex: a + 1 })) }>
                                            <FontAwesomeIcon icon={ faArrowRightSolid } alt="icon" />
                                        </button>
                                    ) : null
                                }
                                <div className="gle-imagemodal-mat-image-path">
                                    {
                                        (this.state.photo.media.length === 1) ? null : (() => {
                                            const a = [];
                                            
                                            this.state.photo.media.forEach((_, io) => a.push(
                                                <div key={ io } className={ `gle-imagemodal-mat-image-path-dot${ (io !== this.state.carouselIndex) ? "" : " active" }` } />
                                            ));

                                            return a;
                                        })()
                                    }
                                </div>
                            </section>
                            <section className="gle-imagemodal-mat-info" ref={(ref) => {
                                if(this.state.isLoading || !ref || !this.viewRef || window.innerWidth <= 850) return;

                                const a = this.viewRef.offsetHeight;
                                if(a && +a !== +ref.offsetHeight) {
                                    ref.style.height = a + "px";
                                    this.forceUpdate();
                                }
                            }}>
                                <div className="gle-imagemodal-mat-info-auth">
                                    <Link onClick={ this.props.closeSelf } to={ `${ links["ACCOUNT_PAGE"].absolute }/${ this.state.photo.creator.login }` } className="gle-imagemodal-mat-info-auth-avatar">
                                        <img src={ api.storage + this.state.photo.creator.avatar } alt="user" />
                                    </Link>
                                    <Link onClick={ this.props.closeSelf } to={ `${ links["ACCOUNT_PAGE"].absolute }/${ this.state.photo.creator.login }` } className="gle-imagemodal-mat-info-auth-name">{ this.state.photo.creator.login }</Link>
                                    {
                                        (!this.state.photo.creator.isVerified) ? null : (
                                            <div className="gle-imagemodal-mat-info-auth-verified">
                                                <img src={ verification_image } alt="This user was verified by finstagram administration" />
                                            </div>
                                        )
                                    }
                                    {
                                        (
                                            this.state.photo.creator.id !== this.clientID ||
                                            this.state.photo.creator.isVerified
                                        ) ? (
                                            <span className="gle-imagemodal-mat-info-auth-split">•</span>
                                        ) : null
                                    }
                                    <button className="gle-imagemodal-mat-info-auth-follow definp" disabled={ this.state.followingCreator } onClick={ this.followCreator }>
                                        {
                                            (this.state.photo.creator.id !== this.clientID) ? (
                                                (!this.state.photo.creator.isFollowing) ? "Follow" : "Following"
                                            ) : null
                                        }
                                    </button>
                                </div>
                                {
                                    (this.state.photo.places.length || this.state.photo.people.length) ? (
                                        this.getEDescription(this.state.photo.places, this.state.photo.people)
                                    ) : null
                                }
                                <div className="gle-imagemodal-mat-info-comments" ref={ ref => this.commentsBlockRef = ref }>
                                    {
                                        (this.state.photo.text) ? (
                                            <Comment
                                                content={ this.state.photo.text }
                                                name={ this.state.photo.creator.getName }
                                                canLike={ false }
                                                checkTags={ true }
                                                login={ this.state.photo.creator.login }
                                            />
                                        ) : null
                                    }
                                    {
                                        (this.state.photo.comments.length && this.state.canLoadComments) ? (
                                            <button className="gle-imagemodal-mat-info-lcomments definp" onClick={ this.loadMoreComments }>
                                                Load more comments
                                            </button>
                                        ) : null
                                    }
                                    {
                                        (!this.state.loadingMoreComments) ? null : (
                                            <img
                                                src={ loadingSpinner }
                                                alt="more comments loading spinner"
                                                className="glei-lspinner margintb"
                                            />
                                        )
                                    }
                                    {
                                        this.state.photo.comments.map(({ id, content, isLiked, creator }) => (
                                            <Comment
                                                key={ id }
                                                id={ id }
                                                content={ content }
                                                isLiked={ isLiked }
                                                name={ creator.getName }
                                                login={ creator.login }
                                                creatorID={ creator.id }
                                            />
                                        ))
                                    }
                                    {
                                        (!this.state.submittingComment) ? null : (
                                            <img
                                                src={ placeholderINST }
                                                alt="comment placeholder"
                                                className="glei-placeholder text one_max"
                                            />
                                        )
                                    }
                                </div>
                                <div className="gle-imagemodal-mat-info-feedback">
                                    <div>
                                        <button className={ `definp gle-port-carousel-feedback-btn${ (!this.state.photo.isLiked) ? "" : " liked" }` } onClick={ this.likePost }>
                                            <FontAwesomeIcon icon={ (!this.state.photo.isLiked) ? faHeartRegular : faHeartSolid } />
                                        </button>
                                        <button className="definp gle-port-carousel-feedback-btn" onClick={ () => this.commentInputRef.focus() }>
                                            <FontAwesomeIcon icon={ faCommentRegular } />
                                        </button>
                                    </div>
                                    <div>
                                        <button className="definp gle-port-carousel-feedback-btn" onClick={ this.addToBookmarks }>
                                            <FontAwesomeIcon icon={ (!this.state.photo.inBookmarks) ? faBookmarkRegular : faBookmarkSolid } />
                                        </button>
                                    </div>
                                </div>
                                <button className="definp gle-imagemodal-mat-info-stricts">{ this.state.photo.likesInt } likes</button>
                                <span className="gle-imagemodal-mat-info-postdate">{ convertTime(this.state.photo.time, "ago") }</span>
                                <CommentInput
                                    className="gle-imagemodal-mat-info-commentinput"
                                    onSubmit={ this.commentPost }
                                    onRef={ ref => this.commentInputRef = ref }
                                    callMenu={() => this.props.callGlobalMenu({
                                        type: "OPTIONS",
                                        buttons: [
                                            {
                                                isRed: false,
                                                action: () => {
                                                    navigator.clipboard.writeText(window.location.host + this.state.directURL);
                                                },
                                                text: "Copy Link",
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
                            </section>
                        </div>
                    ) : (
                        <img
                            alt="loading spinner"
                            style={{ zIndex: "5" }}
                            className="glei-lspinner"
                            src={ loadingSpinner }
                        />
                    )
                }
            </div>
        );
    }
}

const mapStateToProps = ({ session: { floatPhotoModal } }) => ({
    activeData: floatPhotoModal
});

const mapActionsToProps = {
    callGlobalMenu: payload => ({ type: 'SET_GLOBAL_MENU', payload }),
    closeSelf: () => ({ type: 'PREVIEW_FLOAT_MODAL', payload: null }),
    castError: text => ({ type: 'CAST_GLOBAL_ERROR', payload: { text } })
}

export default connect(
    mapStateToProps,
    mapActionsToProps
)(Hero);