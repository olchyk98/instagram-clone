import React, { Component } from 'react';
import './main.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faLayerGroup, faComment, faHeart } from '@fortawesome/free-solid-svg-icons';

const image = "https://scontent-arn2-1.cdninstagram.com/vp/138c59b92433cb36cc61de94f2745ec8/5CE6E0DD/t51.2885-15/e35/51989314_352340255612118_6286252316523219381_n.jpg?_nc_ht=scontent-arn2-1.cdninstagram.com";

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
