import React, { Component } from 'react';
import './main.css';

import Image from '../__forall__/post.preview';

class ExploreSearch extends Component {
    render() {
        return(
            <input
                className="rn-explore-search definp"
                type="text"
                placeholder="Search"
            />
        );
    }
}

class ExploreGrid extends Component {
    render() {
        return(
            <div className="rn-explore-search-grid">
                <Image />
                <Image />
                <Image />
                <Image />
                <Image />
                <Image />
                <Image />
                <Image />
                <Image />
                <Image />
                <Image />
                <Image />
                <Image />
                <Image />
                <Image />
                <Image />
                <Image />
                <Image />
                <Image />
                <Image />
                <Image />
                <Image />
                <Image />
                <Image />
                <Image />
                <Image />
                <Image />
                <Image />
                <Image />
                <Image />
                <Image />
                <Image />
                <Image />
                <Image />
                <Image />
                <Image />
                <Image />
                <Image />
                <Image />
                <Image />
                <Image />
                <Image />
            </div>
        );
    }
}

class Explore extends Component {
    search() {
        if(window.innerWidth > 750) { // search for images

        } else { // search for images and people

        }
    }

    render() {
        return(
            <div className="rn rn-explore">
                <ExploreSearch />
                <ExploreGrid />
            </div>
        );
    }
}

export default Explore;
