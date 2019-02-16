import React, { Component, PureComponent } from 'react';
import './main.css';

import instagram_black_white_logo from '../images/logobw.png';
import instagram_text_logo from '../images/logotext.png';

class Logo extends Component {
    render() {
        return(
            <section className="gl-nav-logo">
                <img className="gl-nav-logo-bw" src={ instagram_black_white_logo } alt="black white instagram logo" />
                <img className="gl-nav-logo-text" src={ instagram_text_logo } alt="text instagram logo" />
            </section>
        );
    }
}

class SearchNav extends Component {
    render() {
        return(
            null
        );
    }
}

class Hero extends Component {
    render() {
        return(
            <nav className="gl-nav">
                <Logo />
            </nav>
        );
    }
}

export default Hero;
