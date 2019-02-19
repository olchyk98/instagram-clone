import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './main.css';

import { gql } from 'apollo-boost';
import { connect } from 'react-redux';

import client from '../../apollo';

import Post from '../__forall__/post';

import placeholderIMG from '../__forall__/placeholderINST.gif';

const avatar = "https://instagram.fbtz1-2.fna.fbcdn.net/vp/c9ab85cb6f08ab4f94827ad427030841/5CDDD9F1/t51.2885-19/44884218_345707102882519_2446069589734326272_n.jpg?_nc_ht=instagram.fbtz1-2.fna.fbcdn.net";

class Feed extends Component {
    render() {
        return(
            <section className="rn-feed-block rn-feed-mat">
                {
                    (this.props.feed) ? (
                        <Post />
                    ) : (
                        <div className="rn-feed-mat-placeholder">
                            <img src={ placeholderIMG } alt="placeholder" className="glei-placeholder text margin l" />
                            <img src={ placeholderIMG } alt="placeholder" className="glei-placeholder text one3 margin l" />
                            <img src={ placeholderIMG } alt="placeholder" className="glei-placeholder big margin prevent ts" />
                        </div>
                    )
                }
            </section>
        );
    }
}

Feed.propTypes = {
    feed: PropTypes.object
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
                        {
                            (this.props.client) ? (
                                <>
                                    <span className="rn-feed-more-account-name-url">oles.odynets</span>
                                    <span className="rn-feed-more-account-name-mat">Oles Odynets</span>
                                </>
                            ) : (
                                <>
                                    <img src={ placeholderIMG } alt="placeholder" className="glei-placeholder text one3" />
                                    <img src={ placeholderIMG } alt="placeholder" className="glei-placeholder text one3" />
                                </>
                            )
                        }
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
    constructor(props) {
        super(props);

        this.state = {
            client: null,
            posts: null
        }
    }

    componentDidMount() {
        this.fetchMain();
    }

    fetchMain = () => {
        client.query({
            query: gql`
                query {
                    user {
                        id,
                        name,
                        login,
                        avatar,
                        feed {
                            id
                        }
                    }
                }
            `,
            fetchPolicity: 'no-cache'
        }).then(({ data: { user } }) => {
            if(!user) return this.props.castError("Something went wrong");

            this.setState(() => ({
                user: {
                    id: user.id,
                    name: user.name,
                    login: user.login,
                    avatar: user.avatar
                },
                posts: user.feed
            }))
        }).catch(console.error);
    }

    render() {
        return(
            <div className="rn rn-feed">
                <Feed
                    feed={ this.state.posts }
                />
                <More
                    client={ this.state.client }
                />
            </div>
        );
    }
}

const mapStateToProps = () => ({});

const mapActionsToProps = {
    castError: text => ({ type: "CAST_GLOBAL_ERROR", payload: { text } })
}

export default connect(
    mapStateToProps,
    mapActionsToProps
)(Hero);
