import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import './main.css';

import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { gql } from 'apollo-boost';

import links from '../../../../links';
import { cookieControl } from '../../../../utils';
import client from '../../../../apollo';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCompass as faCompassRegular,
    faHeart as faHeartRegular,
    faUser as faUserRegular,
    faPaperPlane as faPaperPlaneRegular
} from '@fortawesome/free-regular-svg-icons';
import {
    faPlus as faPlusSolid
} from '@fortawesome/free-solid-svg-icons';

import instagram_black_white_logo from '../images/logobw.png';
import instagram_text_logo from '../images/logotext.png';

const avatar = "https://d1ia71hq4oe7pn.cloudfront.net/og/75335251-1200px.jpg";

class Logo extends Component {
    render() {
        return(
            <Link className="gl-nav-logo" to="/">
                <img className="gl-nav-logo-bw" src={ instagram_black_white_logo } alt="black white instagram logo" />
                <img className="gl-nav-logo-text" src={ instagram_text_logo } alt="text instagram logo" />
            </Link>
        );
    }
}

class RLinksButtonWinItem extends PureComponent {
    render() {
        return(
            <article className="gl-nav-routes-btn-window-list-item">
                <section className="gl-nav-routes-btn-window-list-item-info">
                    <div className="gl-nav-routes-btn-window-list-item-info-image">
                        <img src={ avatar } alt="human" />
                    </div>
                    <div className="gl-nav-routes-btn-window-list-item-info-mat">
                        <span className="gl-nav-routes-btn-window-list-item-info-mat-auth">Oles Odynets</span>
                        <div className="gl-nav-routes-btn-window-list-item-info-mat-content">
                            <span className="gl-nav-routes-btn-window-list-item-info-mat-content-event">Someone did like your tweet.</span>
                            <span className="gl-nav-routes-btn-window-list-item-info-mat-content-time">25w</span>
                        </div>
                    </div>
                </section>
                <section className="gl-nav-routes-btn-window-list-item-actions">
                    <button className="definp gl-nav-routes-btn-window-list-item-route rn-settings-window-options-itemrails-submit">
                        Follow
                    </button>
                </section>
            </article>
        );
    }
}

class RLinksButton extends Component {
    constructor(props) {
        super(props);

        if(props.onPage) {
            this.state = {
                isOpened: false
            }
        }
    }

    static defaultProps = {
        onPage: false
    }

    render() {
        if(this.props.onPage === false) {
            return(
                <Link className="gl-nav-routes-btn definp" title={ this.props._title } to={ this.props.link }>
                    <FontAwesomeIcon icon={ this.props.icon } />
                </Link>
            );
        } else if(this.props.onPage === null) {
            return(
                <button className="gl-nav-routes-btn definp" title={ this.props._title } onClick={ this.props._onClick }>
                    <FontAwesomeIcon icon={ this.props.icon } />
                </button>
            );
        } else if(this.props.onPage === true) {
            return(
                <div
                    className="gl-nav-routes-btn local"
                    title={ this.props._title }
                    tabIndex="-1"
                    onFocus={ () => this.setState({ isOpened: true }) }
                    onBlur={ () => this.setState({ isOpened: false }) }>
                    <button className="gl-nav-routes-btn-mat definp" onClick={ () => this.setState({ isOpened: true }) }>
                        <FontAwesomeIcon icon={ this.props.icon } />
                    </button>
                    <div className={ `gl-nav-routes-btn-window ${ (this.props.windowType) }${ (!this.state.isOpened) ? "" : " active" }` }>
                        <div className="gl-nav-routes-btn-window-list">
                            <RLinksButtonWinItem />
                            <RLinksButtonWinItem />
                            <RLinksButtonWinItem />
                            <RLinksButtonWinItem />
                            <RLinksButtonWinItem />
                            <RLinksButtonWinItem />
                            <RLinksButtonWinItem />
                            <RLinksButtonWinItem />
                            <RLinksButtonWinItem />
                            <RLinksButtonWinItem />
                            <RLinksButtonWinItem />
                            <RLinksButtonWinItem />
                            <RLinksButtonWinItem />
                            <RLinksButtonWinItem />
                            <RLinksButtonWinItem />
                            <RLinksButtonWinItem />
                            <RLinksButtonWinItem />
                            <RLinksButtonWinItem />
                        </div>
                    </div>
                </div>
            );
        }
    }
}

RLinksButton.propTypes = {
    _title: PropTypes.string.isRequired,
    icon: PropTypes.object.isRequired,
    onPage: PropTypes.bool,
    windowType: PropTypes.string,
    _onClick: PropTypes.func,
    link: PropTypes.string
}

class SearchResultItem extends PureComponent {
    render() {
        return(
            <article className="gl-nav-search-results-item">
                <section className="gl-nav-search-results-item-image">
                    {/* <img className="gl-nav-search-results-item-image-mat" src={ image } alt="rev" /> */}
                    <span className="gl-nav-search-results-item-image-hashtag" />
                </section>
                <section className="gl-nav-search-results-item-info">
                    <span className="gl-nav-search-results-item-info-name">oles.odynets</span>
                    <span className="gl-nav-search-results-item-info-more">
                        Oles Odynets
                        {/* name if user and number of posts if it's tag */}
                    </span>
                </section>
            </article>
        );
    }
}

class SearchResults extends PureComponent {
    render() {
        return(
            <div className={ `gl-nav-search-results${ (!this.props.active) ? "" : " active" }` }>
                <div className="gl-nav-search-results-list">
                    <SearchResultItem />
                    <SearchResultItem />
                    <SearchResultItem />
                    <SearchResultItem />
                    <SearchResultItem />
                    <SearchResultItem />
                    <SearchResultItem />
                    <SearchResultItem />
                    <SearchResultItem />
                    <SearchResultItem />
                </div>
            </div>
        );
    }
}

SearchResults.propTypes = {
    active: PropTypes.bool.isRequired
}

class SearchNav extends Component {
    constructor(props) {
        super(props);

        this.state = {
            inFocus: false,
            query: ""
        }
    }

    render() {
        return(
            <section className="gl-nav-searchnav">
                <RLinksButton
                    _title="Direct Messenger"
                    icon={ faPaperPlaneRegular }
                    link={ links["MESSENGER_PAGE"].absolute }
                />
                <RLinksButton
                    _title="Explore"
                    icon={ faCompassRegular }
                    link={ links["EXPLORE_PAGE"].absolute }
                />
                <div className="gl-nav-searchnav-search">
                    <input
                        className="gl-nav-searchnav-search-mat definp"
                        type="search"
                        placeholder="Search"
                        onChange={ ({ target: { value } }) => this.setState({ query: value }) }
                        onFocus={ () => this.setState({ inFocus: true }) }
                        onBlur={ () => this.setState(() => ({ inFocus: false })) }
                    />
                    <SearchResults
                        active={ !!(this.state.inFocus && this.state.query) }
                    />
                </div>
                <RLinksButton
                    _title="Notifications"
                    icon={ faHeartRegular }
                    onPage={ true }
                    windowType="notifications"
                />
                <RLinksButton
                    _title="Account"
                    icon={ faUserRegular }
                    link={ `${ links["ACCOUNT_PAGE"].absolute }/${ this.props.clientURL }` }
                />
            </section>
        );
    }
}

class MoreNav extends Component {
    render() {
        return(
            <div className="gl-nav-morenav">
                <RLinksButton
                    _title="Add new post"
                    icon={ faPlusSolid }
                    onPage={ null }
                    _onClick={ this.props.createPost }
                />
            </div>
        );
    }
}

class Hero extends Component {
    constructor(props) {
        super(props);

        this.state = {
            clientURL: ""
        }
    }

    componentDidMount() {
        client.query({
            query: gql`
                query {
                    user {
                        id,
                        login
                    }
                }
            `
        }).then(({ data: { user } }) => {
            if(!user) { // Session was not confirmed.
                this.props.castError("Session wasn't confirmed. Please, log in.");

                cookieControl.delete("userid");
                window.location.href = "/";

                return;
            }

            this.setState(() => ({
                clientURL: user.login
            }));
        }).catch(console.error);
    }

    render() {
        return(
            <nav className="gl-nav">
                <Logo />
                <SearchNav
                    clientURL={ this.state.clientURL }
                />
                <MoreNav
                    createPost={ this.props.createPost }
                />
            </nav>
        );
    }
}

const mapStateToProps = () => ({});

const mapActionsToProps = {
    createPost: () => ({ type: "CREATE_NEW_POST", payload: true }),
    castError: text => ({ type: "CAST_GLOBAL_ERROR", payload: { text } })
}

export default connect(
    mapStateToProps,
    mapActionsToProps
)(Hero);
