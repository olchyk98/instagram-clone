import React, { Component } from 'react';
import './main.css';

import verification_image from '../images/verification.png';

import client from '../../../apollo';
import api from '../../../api';
import { cookieControl } from '../../../utils';

import { connect } from 'react-redux';
import { gql } from 'apollo-boost';

import Comment from '../post.comment';
import CommentInput from '../post.commentinput';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faHeart as faHeartRegular,
    faComment as faCommentRegular,
    faBookmark as faBookmarkRegular
} from '@fortawesome/free-regular-svg-icons';

import loadingSpinner from '../loadingico.gif';

class Hero extends Component {
    constructor(props) {
        super(props);

        this.state = {
            photo: null,
            active: false,
            isLoading: true
        }

        this.viewRef = React.createRef();
        this.clientID = null;
    }

    // TODO: Tag description
    // TODO: Multimedia scroll
    // TODO: Video play / pause
    // TODO: Erase data when user quits

    componentDidMount() {
        this.clientID = cookieControl.get("userid");
        this.forceUpdate();
    }

    componentDidUpdate(prevProps) {
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
                    isLoading: true
                }), () => this.fetchPhoto(this.props.activeData.id));
            } else {
                this.setState(() => ({
                    active: false,
                    isLoading: true
                }));
            }
        }
    }

    fetchPhoto = targetID => {
        client.query({
            query: gql`
                query($targetID: ID!) {
                    post(targetID: $targetID) {
                        id,
                        media {
                            id,
                            url
                        },
                        creator {
                            id,
                            login,
                            avatar,
                            isVerified,
                            isFollowing
                        },
                        comments {
                            id,
                            content,
                            isLiked,
                            creator {
                                id,
                                name
                            }
                        },
                        likesInt,
                        isLiked,
                        time
                    }
                }
            `,
            variables: {
                targetID
            }
        }).then(({ data: { post } }) => {
            if(!post) return this.props.castError("We couldn't load this post. Please, try later.");

            this.setState(() => ({
                photo: post,
                isLoading: false
            }));
        }).catch(console.error);
    }

    render() {
        return(
            <div className={ `gle-imagemodal${ (!this.state.active) ? "" : " active" }` }>
                <div
                    className="gle-imagemodal-bg"
                    onClick={ this.props.closeSelf }
                />
                {
                    (!this.state.isLoading) ? (
                        <div className="gle-imagemodal-mat">
                            <section className="gle-imagemodal-mat-image" ref={ ref => this.viewRef = ref }>
                                <img src={ api.storage + this.state.photo.media[0].url } alt="target" />
                            </section>
                            <section className="gle-imagemodal-mat-info" ref={(ref) => {
                                if(this.state.isLoading || !ref || !this.viewRef) return;
                                ref.style.height = this.viewRef.getBoundingClientRect().height + "px";
                            }}>
                                <div className="gle-imagemodal-mat-info-auth">
                                    <div className="gle-imagemodal-mat-info-auth-avatar">
                                        <img src={ api.storage + this.state.photo.creator.avatar } alt="user" />
                                    </div>
                                    <span className="gle-imagemodal-mat-info-auth-name">{ this.state.photo.creator.login }</span>
                                    {
                                        (!this.state.photo.creator.isVerified) ? null : (
                                            <div className="gle-imagemodal-mat-info-auth-verified">
                                                <img src={ verification_image } alt="This user was verified by finstagram administration" />
                                            </div>
                                        )
                                    }
                                    <span className="gle-imagemodal-mat-info-auth-split">•</span>
                                    <button className="gle-imagemodal-mat-info-auth-follow definp">
                                        {
                                            (this.state.photo.creator.id !== this.clientID) ? (
                                                (!this.state.photo.isFollowing) ? "Follow" : "Following"
                                            ) : null
                                        }
                                    </button>
                                </div>
                                <div className="gle-imagemodal-mat-info-comments">
                                    <Comment />
                                    {/* content: PropTypes.string.isRequired, */}
                                    {/* name: PropTypes.string.isRequired, */}
                                    {/* canLike: PropTypes.bool, */}
                                    {/* id: PropTypes.string.isRequired, */}
                                    {/* isLiked: PropTypes.bool, */}
                                    {/* checkTags: PropTypes.bool */}
                                    <button className="gle-imagemodal-mat-info-lcomments definp">
                                        Load more comments
                                    </button>   
                                    <Comment />
                                    <Comment />
                                    <Comment />
                                    <Comment />
                                    <Comment />
                                    <Comment />
                                    <Comment />
                                    <Comment />
                                    <Comment />
                                    <Comment />
                                    <Comment />
                                    <Comment />
                                    <Comment />
                                    <Comment />
                                    <Comment />
                                    <Comment />
                                    <Comment />
                                </div>
                                <div className="gle-imagemodal-mat-info-feedback">
                                    <div>
                                        <button className="definp gle-port-carousel-feedback-btn">
                                            <FontAwesomeIcon icon={ faHeartRegular } />
                                        </button>
                                        <button className="definp gle-port-carousel-feedback-btn">
                                            <FontAwesomeIcon icon={ faCommentRegular } />
                                        </button>
                                    </div>
                                    <div>
                                        <button className="definp gle-port-carousel-feedback-btn">
                                            <FontAwesomeIcon icon={ faBookmarkRegular } />
                                        </button>
                                    </div>
                                </div>
                                <button className="definp gle-imagemodal-mat-info-stricts">{ this.state.photo.likesInt } likes</button>
                                <span className="gle-imagemodal-mat-info-postdate">1 day ago</span>
                                <CommentInput
                                    className="gle-imagemodal-mat-info-commentinput"
                                    callMenu={() => this.props.callGlobalMenu({
                                        type: "OPTIONS",
                                        buttons: [
                                            {
                                                isRed: true,
                                                action: () => null,
                                                text: "Report the post"
                                            },
                                            {
                                                isRed: false,
                                                action: () => null,
                                                text: "Copy Link"
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
    closeSelf: () => ({ type: 'PREVIEW_FLOAT_MODAL', payload: null })
}

export default connect(
    mapStateToProps,
    mapActionsToProps
)(Hero);