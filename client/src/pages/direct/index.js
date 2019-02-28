import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import './main.css';

import client from '../../apollo';
import api from '../../api';
import { cookieControl, convertTime } from '../../utils';

import { gql } from 'apollo-boost';
import { connect } from 'react-redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faHeart, faPaperPlane } from '@fortawesome/free-regular-svg-icons';

import placeholderINST from '../__forall__/placeholderINST.gif';
import loadingSpinner from '../__forall__/loadingico.gif';

const avatar = "https://i.ytimg.com/vi/SfLV8hD7zX4/maxresdefault.jpg";

class ConversationsItem extends PureComponent {
    render() {
        return(
            <article className={ `rn-direct-conversations-item${ (!this.props.isActive) ? "" : " active" }` } onClick={ this.props._onClick }>
                <div className="rn-direct-conversations-item-avatar">
                    <img src={ api.storage + this.props.image } alt="user" />
                </div>
                <div className="rn-direct-conversations-item-info">
                    <span className="rn-direct-conversations-item-info-name">
                        { this.props.name }
                    </span>
                    {
                        (this.props.content) ? (
                            <span className="rn-direct-conversations-item-info-last">
                                { this.props.content }
                            </span>
                        ) : null
                    }
                </div>
            </article>
        );
    }
}

ConversationsItem.propTypes = {
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    id: PropTypes.string,
    content: PropTypes.string.isRequired
}

class Conversations extends Component {
    render() {
        return(
            <section className="rn-direct-conversations">
                <div className="rn-direct-conversations-mat">
                    {
                        (!this.props.isLoading) ? (
                            this.props.conversations.map(({ id, content, image, name }) => (
                                <ConversationsItem
                                    key={ id }
                                    id={ id }
                                    content={ content }
                                    image={ image }
                                    name={ name }
                                    isActive={ this.props.activeID === id }
                                    _onClick={ () => this.props.onSelect(id) }
                                />
                            ))
                        ) : (
                            (() => {
                                const output = [];

                                for(let ma = 0; ma < 8; ma++) {
                                    output.push(
                                        <img
                                            key={ ma }
                                            className="glei-placeholder fullparent w text bgh_d margintb"
                                            alt="conversation placeholder"
                                            src={ placeholderINST }
                                        />
                                    );
                                }

                                return output;
                            })()
                        )
                    }
                </div>
            </section>
        );
    }
}

Conversations.propTypes = {
    onSelect: PropTypes.func.isRequired
}

class ChatHeader extends PureComponent {
    render() {
        return(
            <header className="rn-direct-chat-header">
                <section className="rn-direct-chat-header-info">
                    <div className="rn-direct-chat-header-info-avatar">
                        <img src={ this.props.image } alt="user" />
                    </div>
                    <div className="rn-direct-chat-header-info-mat">
                        <span className="rn-direct-chat-header-info-mat-name">
                            { this.props.name }
                        </span>
                        <span className="rn-direct-chat-header-info-mat-messages">
                            { this.props.messages } message{ (this.props.messaegs !== 1) ? "s" : "" }
                        </span>
                    </div>
                </section>
            </header>
        );
    }
}

class ChatDisplayMessage extends PureComponent {
    render() {
        return(
            <div className={ `rn-direct-chat-display-message_container${ (!this.props.byClient) ? "" : " client" }` }>
                <article className="rn-direct-chat-display-message">
                    <div className="rn-direct-chat-display-message-avatar">
                        <img src={ api.storage + avatar } alt="user" />
                    </div>
                    <div className="rn-direct-chat-display-message-content">
                        <div className="rn-direct-chat-display-message-content-blank">
                            <span>
                                { this.props.content }
                            </span>
                        </div>
                        <div className="rn-direct-chat-display-message-content-details">
                            <span>{ convertTime(this.props.time, "", true, true) }</span>
                        </div>
                    </div>
                </article>
            </div>
        );
    }
}

ChatDisplayMessage.propTypes = {
    byClient: PropTypes.bool.isRequired,
    content: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired
}

class ChatDisplay extends Component {
    constructor(props) {
        super(props);

        this.clientID = cookieControl.get("userid");
    }

    render() {
        return(
            <div className="rn-direct-chat-display">
                {
                    this.props.messages.map(({ id, creator, content, type, time }) => (
                        <ChatDisplayMessage
                            key={ id }
                            content={ content }
                            type={ type }
                            image={ api.storage + creator.avatar }
                            time={ time }
                            byClient={ this.clientID === creator.id }
                        />
                    ))
                }
            </div>
        );
    }
}

class ChatInputBtn extends PureComponent {
    static defaultProps = {
        type: "button"
    }

    render() {
        return(
            <button type={ this.props.type } className="rn-direct-chat-input-mat-media definp">
                <FontAwesomeIcon icon={ this.props.icon } />
            </button>
        );
    }
}

ChatInputBtn.propTypes = {
    icon: PropTypes.object.isRequired,
    type: PropTypes.string
}

class ChatInput extends Component {
    render() {
        return(
            <div className="rn-direct-chat-input">
                <form className="rn-direct-chat-input-mat" onSubmit={ e => e.preventDefault() }>
                    <input
                        type="text"
                        placeholder="Type a message..."
                        className="rn-direct-chat-input-mat-field definp"
                    />
                    <div className="rn-direct-chat-input-mat-media">
                        <ChatInputBtn
                            icon={ faImage }
                        />
                        <ChatInputBtn
                            icon={ faHeart }
                        />
                        <ChatInputBtn
                            icon={ faPaperPlane }
                            type="submit"
                        />
                    </div>
                </form>
            </div>
        );
    }
}

class Chat extends Component {
    render() {
        return(
            <section className="rn-direct-chat">
                {
                    (!this.props.isLoading) ? (
                        (this.props.dialog !== null) ? (
                            <>
                                <ChatHeader
                                    name={ this.props.dialog.name }
                                    image={ api.storage + this.props.dialog.image }
                                    messages={ this.props.dialog.messagesInt }
                                />
                                <ChatDisplay
                                    messages={ this.props.dialog.messages }
                                />
                                <ChatInput />
                            </>
                        ) : null
                    ) : (
                        <img src={ loadingSpinner } alt="loading spinner" className="glei-lspinner blockcentered" />
                    )
                }
            </section>
        );
    }
}

class Hero extends Component {
    constructor(props) {
        super(props);

        this.state = {
            chat: null,
            conversations: null,
            isLoadingChat: false,
            isLoadingConversations: true
        }
    }

    componentDidMount() {
        this.loadConversations();
    }

    loadConversations = () => {
        client.query({
            query: gql`
                query {
                    user {
                        id,
                        conversations {
                            id,
                            image,
                            content,
                            name
                        }
                    }
                }
            `
        }).then(({ data: { user } }) => {
            if(!user) return this.props.castError("Something went wrong..");

            this.setState(() => ({
                conversations: user.conversations,
                isLoadingConversations: false
            }));
        })
    }

    loadDialog = id => {
        if(this.state.isLoadingChat || (this.state.chat && this.state.chat.id === id)) return;

        this.setState(() => ({
            isLoadingChat: true
        }));

        client.query({
            query: gql`
                query($targetID: ID!) {
                    conversation(targetID: $targetID) {
                        id,
                        name,
                        image,
                        messagesInt,
                        messages {
                            id,
                            type,
                            time,
                            content,
                            creator {
                                id,
                                avatar
                            }
                        }
                    }
                }
            `,
            variables: {
                targetID: id
            }
        }).then(({ data: { conversation } }) => {
            this.setState(() => ({
                isLoadingChat: false
            }));

            if(!conversation) return this.props.castError("Something went wrong");

            this.setState(() => ({
                chat: conversation
            }));
        })
    }

    render() {
        return(
            <div className="rn rn-direct">
                <Conversations
                    isLoading={ this.state.isLoadingConversations }
                    conversations={ this.state.conversations }
                    onSelect={ this.loadDialog }
                    activeID={ this.state.chat && this.state.chat.id }
                />
                <Chat
                    isLoading={ this.state.isLoadingChat }
                    dialog={ this.state.chat }
                />
            </div>
        );
    }
}

const mapStateToProps = () => ({});

const mapActionsToProps = {
    castError: text => ({ type: 'CAST_GLOBAL_ERROR', payload: { text } })
}

export default connect(
    mapStateToProps,
    mapActionsToProps
)(Hero);
