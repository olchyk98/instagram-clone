import React, { Component } from 'react';
import './main.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-regular-svg-icons';

class Comment extends Component {
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

export default Comment;