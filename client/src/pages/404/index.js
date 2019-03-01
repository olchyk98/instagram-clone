import React, { Component } from 'react';
import './main.css';

import { Link } from 'react-router-dom';

import links from '../../links';

class P404 extends Component {
    render() {
        return(
            <div className="rn rn-404">
                <section className="rn-404-block">
                    <h3 className="rn-404-title">Sorry, this page isn't available.</h3>
                    <p className="rn-404-description">
                        The link you followed may be broken, or the page may have been removed. <Link to={ links["FEED_PAGE"].absolute }>Go back to FInstagram.</Link>
                    </p>
                </section>
            </div>
        );
    }
}

export default P404;
