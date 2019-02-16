import React, { Component } from 'react';
import './main.css';

class PostPreview extends Component {
    render() {
        return(
            <article className="rn-account-posts-item" title="Open photo">
                <div className="rn-account-posts-item-hover">
                    <div className="rn-account-posts-item-hover-stats">
                        <div>
                            <FontAwesomeIcon icon={ faHeart } />
                        </div>
                        <span>45.1k</span>
                    </div>
                    <div className="rn-account-posts-item-hover-stats">
                        <div>
                            <FontAwesomeIcon icon={ faComment } />
                        </div>
                        <span>524</span>
                    </div>
                </div>
                <div className="rn-account-posts-item-marks">
                    <span className="rn-account-posts-item-marks-item">
                        <FontAwesomeIcon icon={ faPlay } />
                    </span>
                    <span className="rn-account-posts-item-marks-item">
                        <FontAwesomeIcon icon={ faLayerGroup } />
                    </span>
                </div>
                <img className="rn-account-posts-item-preview" alt="preview"
                    src={ image }
                />
            </article>
        );
    }
}

export default PostPreview;
