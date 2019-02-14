import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './main.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { faHeart, faComment, faBookmark } from '@fortawesome/free-regular-svg-icons';

const avatar = "https://instagram.fbtz1-2.fna.fbcdn.net/vp/c9ab85cb6f08ab4f94827ad427030841/5CDDD9F1/t51.2885-19/44884218_345707102882519_2446069589734326272_n.jpg?_nc_ht=instagram.fbtz1-2.fna.fbcdn.net";

class PostCarousel extends Component {
    constructor(props) {
        super(props);

        this.state = {
            images: [
                'http://all4desktop.com/data_images/original/4235788-wallpaper-full-hd.jpg',
                'http://all4desktop.com/data_images/original/4235788-wallpaper-full-hd.jpg',
                'http://all4desktop.com/data_images/original/4235788-wallpaper-full-hd.jpg'
            ],
            position: 0
        }
    }

    moveCarousel = dir => this.setState(({ images, position }) => ({
        position: (images[position + dir]) ? position + dir : position
    }));

    render() {
        return(
            <section className="gle-post-carousel">
                <div className="gle-post-carousel-target">
                    <div className="gle-post-carousel-controls">
                        {
                            (this.state.images[this.state.position - 1]) ? (
                                <button
                                    className="gle-post-carousel-controls-btn definp"
                                    onClick={ () => this.moveCarousel(-1) }>
                                    <FontAwesomeIcon icon={ faChevronLeft } />
                                </button>
                            ) : <div />
                        }
                        {
                            (this.state.images[this.state.position + 1]) ? (
                                <button
                                    className="gle-post-carousel-controls-btn definp"
                                    onClick={ () => this.moveCarousel(1) }>
                                    <FontAwesomeIcon icon={ faChevronRight } />
                                </button>
                            ) : <div />
                        }
                    </div>
                    {
                        this.state.images.map((session, index) => (
                            <img
                                key={ index }
                                className={
                                    `gle-post-carousel-image${ (this.state.position > index) ? " old" : (this.state.position < index) ? " new" : " current" }`
                                }
                                alt="target" // TODO: Use cfc AI
                                src={ session }
                            />
                        ))
                    }
                </div>
                <div className="gle-post-carousel-path">
                    <div className="gle-post-carousel-path-mat">
                        {
                            Array(this.state.images.length).fill(null).map((_, index) => (
                                <button key={ index } className={ `gle-post-carousel-path-btn definp${ (this.state.position !== index) ? "" : " active" }` } />
                            ))
                        }
                    </div>
                    <div className="gle-port-carousel-feedback">
                    <div>
                            <button className="gle-port-carousel-feedback-btn definp" onClick={ () => null }>
                                <FontAwesomeIcon icon={ faHeart } />
                            </button>
                            <button className="gle-port-carousel-feedback-btn definp" onClick={ () => null }>
                                <FontAwesomeIcon icon={ faComment } />
                            </button>
                        </div>
                        <div>
                            <button className="gle-port-carousel-feedback-btn definp" onClick={ () => null }>
                                <FontAwesomeIcon icon={ faBookmark } />
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

class PostCommentItem extends Component {
    render() {
        return(
            <article className="gle-post-commentitem">
                <div className="gle-post-commentitem-content">
                    <span className="gle-post-commentitem-content-name">
                        oles.odynets
                    </span>
                    <span className="gle-post-commentitem-content-mat">
                        Berlin Station” (Epix / Netflix)
                    </span>
                </div>
                <button className="gle-post-commentitem-like definp">
                    <FontAwesomeIcon icon={ faHeart } />
                </button>
            </article>
        );
    }
}

class PostComments extends Component {
    render() {
        return(
            <div className="gle-post-comments">
                <button className="gle-post-comments-lmore definp">
                    Load more comments
                </button>
                <PostCommentItem />
                <PostCommentItem />
                <PostCommentItem />
                <PostCommentItem />
                <PostCommentItem />
                <PostCommentItem />
                <PostCommentItem />
                <PostCommentItem />
                <PostCommentItem />
            </div>
        );
    }
}

class CommentInput extends Component {
    render() {
        return(
            <section className="gle-post-commentinput">
                <input
                    className="gle-post-commentinput-mat definp"
                    type="text"
                    placeholder="Add a comment"
                />
                <div className="gle-post-commentinput-options">
                    <button className="definp gle-post-commentinput-options-btn">
                        <FontAwesomeIcon icon={ faEllipsisH } />
                    </button>
                </div>
            </section>
        );
    }
}

class Post extends Component {
    render() {
        return(
            <article className="gle-post">
                <section className="gle-post-auth">
                    <div className="gle-post-auth-avatar">
                        <img src={ avatar } alt="post author" />
                    </div>
                    <span className="gle-post-auth-name">oles.odynets</span>
                </section>
                <PostCarousel />
                <span className="gle-post-stricts">3 893 likes</span>
                <PostCommentItem />
                <PostComments />
                <CommentInput />
            </article>
        );
    }
}

export default Post;