import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import './main.css';

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { gql } from 'apollo-boost';

import links from '../../../../links';
import client from '../../../../apollo';
import { cookieControl } from '../../../../utils';

import Search from './Search';

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

class Logo extends PureComponent {
    render() {
        return(
            <Link to={ links["FEED_PAGE"].absolute } className="gl-nav-logo">
                <div className="gl-nav-logo-image gl-nav-logo-bwlogo">
                    <img src={ instagram_black_white_logo } alt="logo" />
                </div>
                <div className="gl-nav-logo-split" />
                <div className="gl-nav-logo-image gl-nav-logo-textlogo">
                    <img src={ instagram_text_logo } alt="logo text" />
                </div>
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
        } else {
            return(
                <>
                    <div className={ `gl-nav-routes-btn_winbg${ (!this.state.isOpened) ? "" : " active" }` } onClick={ () => this.setState({ isOpened: false }) } />
                    <div className="gl-nav-routes-btn local" title={ this.props._title }>
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
                </>
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

class RLinks extends PureComponent { // RouteLinks
    render() {
        return(
            <section className="gl-nav-routes">
                <RLinksButton
                    _title="Add new post"
                    icon={ faPlusSolid }
                    onPage={ null }
                    _onClick={ this.props.createPost }
                />
                <RLinksButton
                    _title="Direct Messenger"
                    onPage={ false }
                    icon={ faPaperPlaneRegular }
                    link={ `${ links["ACCOUNT_PAGE"].absolute }/${ this.props.clientURL }` }
                />
                <RLinksButton
                    _title="Explore"
                    onPage={ false }
                    icon={ faCompassRegular }
                    link={ `${ links["ACCOUNT_PAGE"].absolute }/${ this.props.clientURL }` }
                />
                <RLinksButton
                    _title="Notifications"
                    icon={ faHeartRegular }
                    onPage={ true }
                    windowType="notifications"
                />
                <RLinksButton
                    _title="Account"
                    icon={ faUserRegular }
                    onPage={ false }
                    link={ `${ links["ACCOUNT_PAGE"].absolute }/${ this.props.clientURL }` }
                />
            </section>
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
                <Search />
                <RLinks
                    clientURL={ this.state.clientURL }
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
