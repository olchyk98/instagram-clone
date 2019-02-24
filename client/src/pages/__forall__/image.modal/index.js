import React, { Component } from 'react';
import './main.css';

import verification_image from '../images/verification.png';

import client from '../../../apollo';

import { connect } from 'react-redux';
import { gql } from 'apollo-boost';

import Comment from '../post.comment';
import CommentInput from '../post.commentinput';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faComment, faBookmark } from '@fortawesome/free-regular-svg-icons';

const image = "https://scontent-arn2-1.cdninstagram.com/vp/76899c4d53ad9917b9ca6d352b4df3f7/5D023554/t51.2885-15/e35/51246729_266849914212411_4636084601688378606_n.jpg?_nc_ht=scontent-arn2-1.cdninstagram.com";

class Hero extends Component {
    constructor(props) {
        super(props);

        this.state = {
            photo: null,
            active: false,
            isLoading: false
        }
    }

    // TODO: Tag description
    // TODO: Multimedia scroll
    // TODO: Video play / pause
    // TODO: Erase data when user quits

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
            console.log("UDPATED");
            if(this.props.activeData) {
                this.fetchPhoto(this.props.activeData.id);
                this.setState(() => ({
                    active: true,
                    isLoading: true
                }));
            } else {
                this.setState(() => ({
                    active: false
                }));
            }
        }
    }

    fetchPhoto = targetID => {
        client.query({
            query: gql`
                query($targetID: ID!) {
                    post(targetID: $targetID) {
                        id
                    }
                }
            `,
            variables: {
                targetID
            }
        }).then(({ data: { post } }) => {
            if(!post) return this.props.castError("We couldn't load this post. Please, try later.");

            this.setState(() => ({
                photo: post
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
                <div className="gle-imagemodal-mat">
                    <section className="gle-imagemodal-mat-image">
                        <img src={ image } alt="target" />
                    </section>
                    <section className="gle-imagemodal-mat-info">
                        <div className="gle-imagemodal-mat-info-auth">
                            <div className="gle-imagemodal-mat-info-auth-avatar">
                                <img src={ image } alt="user" />
                            </div>
                            <span className="gle-imagemodal-mat-info-auth-name">oles.odynets</span>
                            <div className="gle-imagemodal-mat-info-auth-verified">
                                <img src={ verification_image } alt="This user was verified by finstagram administration" />
                            </div>
                            <span className="gle-imagemodal-mat-info-auth-split">•</span>
                            <button className="gle-imagemodal-mat-info-auth-follow definp">Follow</button>
                        </div>
                        <div className="gle-imagemodal-mat-info-comments">
                            <Comment />
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
                                    <FontAwesomeIcon icon={ faHeart } />
                                </button>
                                <button className="definp gle-port-carousel-feedback-btn">
                                    <FontAwesomeIcon icon={ faComment } />
                                </button>
                            </div>
                            <div>
                                <button className="definp gle-port-carousel-feedback-btn">
                                    <FontAwesomeIcon icon={ faBookmark } />
                                </button>
                            </div>
                        </div>
                        <button className="definp gle-imagemodal-mat-info-stricts">310 likes</button>
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