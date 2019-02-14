import React, { Component } from 'react';
import './main.css';

import Post from '../__forall__/post';

const avatar = "https://instagram.fbtz1-2.fna.fbcdn.net/vp/c9ab85cb6f08ab4f94827ad427030841/5CDDD9F1/t51.2885-19/44884218_345707102882519_2446069589734326272_n.jpg?_nc_ht=instagram.fbtz1-2.fna.fbcdn.net";

class Feed extends Component {
    render() {
        return(
            <section className="rn-feed-block rn-feed-mat">
                <Post />
                <Post />
                <Post />
                <Post />
                <Post />
                <Post />
                <Post />
                <Post />
                <Post />
                <Post />
                <Post />
                <Post />
                <Post />
                <Post />
                <Post />
                <Post />
                <Post />
                <Post />
                <Post />
            </section>
        );
    }
}

class More extends Component {
    render() {
        return(
            <section className="rn-feed-block rn-feed-more">
                <div className="rn-feed-more-account">
                    <div className="rn-feed-more-account-avatar">
                        <img src={ avatar } alt="user" />
                    </div>
                    <div className="rn-feed-more-account-name">
                        <span className="rn-feed-more-account-name-url">oles.odynets</span>
                        <span className="rn-feed-more-account-name-mat">Oles Odynets</span>
                    </div>
                </div>
                <span className="rn-feed-more-copyright">
                    @FINSTAGRAM, 2019. <br />
                    Instagram fake. <br />
                    Oles Odynets
                </span>
            </section>
        );
    }
}

class Hero extends Component {
    render() {
        return(
            <div className="rn rn-feed">
                <Feed />
                <More />
            </div>
        );
    }
}

export default Hero;