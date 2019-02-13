import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './main.css';

import Search from './Search';

// WARNING: FontAwesome icon :: object
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCompass as faCompassRegular,
    faHeart as faHeartRegular,
    faUser as faUserRegular
} from '@fortawesome/free-regular-svg-icons';

import instagram_black_white_logo from './images/logobw.png';
import instagram_text_logo from './images/logotext.png';

class Logo extends Component {
    render() {
        return(
            <section className="gl-nav-logo">
                <div className="gl-nav-logo-image gl-nav-logo-bwlogo">
                    <img src={ instagram_black_white_logo } alt="logo" />
                </div>
                <div className="gl-nav-logo-split" />
                <div className="gl-nav-logo-image gl-nav-logo-textlogo">
                    <img src={ instagram_text_logo } alt="logo text" />
                </div>
            </section>
        );
    }
}

class RLinksButton extends Component {
    render() {
        return(
            <button className="gl-nav-routes-btn definp" title={ this.props._title }>
                <FontAwesomeIcon icon={ this.props.icon } />
            </button>
        );
    }
}

RLinksButton.propTypes = {
    _title: PropTypes.string.isRequired,
    icon: PropTypes.object.isRequired
}

class RLinks extends Component { // RouteLinks
    render() {
        return(
            <section className="gl-nav-routes">
                <RLinksButton
                    _title="Explore"
                    icon={ faCompassRegular }
                />
                <RLinksButton
                    _title="Notifications"
                    icon={ faHeartRegular }
                />
                <RLinksButton
                    _title="Account"
                    icon={ faUserRegular }
                />
            </section>
        );
    }
}

class Hero extends Component {
    render() {
        return(
            <div className="gl-nav">
                <Logo />
                <Search />
                <RLinks />
            </div>
        );
    }
}

export default Hero;