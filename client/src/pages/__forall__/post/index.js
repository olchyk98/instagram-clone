import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './main.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const avatar = "https://instagram.fbtz1-2.fna.fbcdn.net/vp/c9ab85cb6f08ab4f94827ad427030841/5CDDD9F1/t51.2885-19/44884218_345707102882519_2446069589734326272_n.jpg?_nc_ht=instagram.fbtz1-2.fna.fbcdn.net";

class PostCarousel extends Component {
    constructor(props) {
        super(props);

        this.state = {
            images: [
                'https://www.adorama.com/alc/wp-content/uploads/2017/11/shutterstock_114802408-825x465.jpg',
                'https://www.adorama.com/alc/wp-content/uploads/2017/11/shutterstock_114802408-825x465.jpg',
                'https://www.adorama.com/alc/wp-content/uploads/2017/11/shutterstock_114802408-825x465.jpg'
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
                    {
                        Array(this.state.images.length).fill(null).map((session, index) => (
                            <button className={ `gle-post-carousel-path-btn definp${ (this.state.position !== index) ? "" : " active" }` } />
                        ))
                    }
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
            </article>
        );
    }
}

export default Post;