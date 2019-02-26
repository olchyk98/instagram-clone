import React, { Component } from 'react';
import './main.css';

import Post from '../__forall__/post.preview';

const image = "https://scontent-arn2-1.cdninstagram.com/vp/eedc7e81274a06c841b9a06669fe780c/5D19D5F4/t51.2885-15/e35/c104.0.542.542/s150x150/52986083_2068252246545129_5087273367398740636_n.jpg?_nc_ht=scontent-arn2-1.cdninstagram.com";

class Tag extends Component {
    render() {
        return(
            <div className="rn rn-tag">
                <div className="rn-tag-content">
                    <header className="rn-tag-header">
                        <section className="rn-tag-header-avatar">
                            <img src={ image } alt="tag preview" />
                        </section>
                        <section className="rn-tag-header-info">
                            <span className="rn-tag-header-info-name">#tags</span>
                            <div className="rn-tag-header-info-posts">
                                <span className="value">8,691,458</span>
                                <span>posts</span>
                            </div>
                            <button className="rn-tag-header-info-follow definp">Follow</button>
                        </section>
                    </header>
                    <section className="rn-tag-posts">
                        <span className="rn-tag-posts-marker">Recent posts</span>
                        <div className="rn-tag-posts-grid"></div>
                    </section>
                </div>
            </div>
        );
    }
}

export default Tag;