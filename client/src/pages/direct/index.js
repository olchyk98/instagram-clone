import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import './main.css';

import client from '../../apollo';
import api from '../../api';
import { cookieControl, convertTime } from '../../utils';
import links from '../../links';

import { gql } from 'apollo-boost';
import { connect } from 'react-redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faHeart, faPaperPlane } from '@fortawesome/free-regular-svg-icons';

import placeholderINST from '../__forall__/placeholderINST.gif';
import loadingSpinner from '../__forall__/loadingico.gif';

import sticker_heart from './stickers/heart.svg';

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
                        (this.props.contentType !== "DEFAULT" || this.props.content) ? (
                            <span className="rn-direct-conversations-item-info-last">
                                {
                                    {
                                        "DEFAULT": this.props.content,
                                        "LIKE": "*Liked you*",
                                        "IMAGE": "*Sent an image*"
                                    }[this.props.contentType]
                                }
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
                            this.props.conversations.map(({ id, lastMessage, conv }) => (
                                <ConversationsItem
                                    key={ id }
                                    id={ id }
                                    content={ lastMessage.content }
                                    contentType={ lastMessage.type }
                                    image={ conv.avatar }
                                    name={ conv.getName }
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
                        <img src={ (avatar !== null) ? api.storage + avatar : placeholderINST } alt="user" />
                    </div>
                    <div className="rn-direct-chat-display-message-content">
                        {
                            (this.props.type === "DEFAULT") ? (
                                <div className="rn-direct-chat-display-message-content-blank">
                                    <span>
                                        { this.props.content }
                                    </span>
                                </div>
                            ) : (this.props.type === "IMAGE") ? (
                                <div className="rn-direct-chat-display-message-content-image">
                                    <img
                                        src={ (this.props.content !== null) ? api.storage + this.props.content : placeholderINST }
                                        alt="message content"
                                    />
                                </div>
                            ) : (this.props.type === "LIKE") ? (
                                <img
                                    src={ sticker_heart }
                                    className="rn-direct-chat-display-message-content-sticker"
                                    alt="heart sticker"
                                />
                            ) : null
                        }
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
    content: PropTypes.string, // null, when it's a file that what's uploaded right now.
    type: PropTypes.string.isRequired,
    image: PropTypes.string,
    time: PropTypes.string.isRequired
}

class ChatDisplay extends PureComponent {
    constructor(props) {
        super(props);

        this.clientID = cookieControl.get("userid");
        this.matRef = React.createRef();
    }

    componentDidMount() {
        this.scrollDisplay();
    }

    componentDidUpdate(p_props) {
        if(p_props.messages.length !== this.props.messages.length) this.scrollDisplay();
    }

    scrollDisplay = () => {
        this.matRef.scrollTop = this.matRef.scrollHeight;
    }

    render() {
        return(
            <div className="rn-direct-chat-display" ref={ ref => this.matRef = ref }>
                {
                    this.props.messages.map(({ id, creator, content, type, time }) => (
                        <ChatDisplayMessage
                            key={ id }
                            content={ content }
                            type={ type }
                            image={ creator.avatar }
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
            <button className="rn-direct-chat-input-mat-media-btn definp" onClick={ this.props._onClick }>
                <FontAwesomeIcon icon={ this.props.icon } />
            </button>
        );
    }
}

ChatInputBtn.propTypes = {
    icon: PropTypes.object.isRequired,
    type: PropTypes.string,
    _onClick: PropTypes.func.isRequired
}

class ChatInput extends Component {
    constructor(props) {
        super(props);

        this.matRef = React.createRef();
    }

    sendMessage = (type, content, clearField = false, isFile = false) => {
        if(
            (type === "DEFAULT" && !content.replace(/\s|\n/g, "").length) ||
            (type === "IMAGE" && !content.type.includes('image'))
        ) return;

        this.props._onSubmit({ type, content, isFile });

        if(clearField) this.matRef.value = "";
    }

    render() {
        return(
            <div className="rn-direct-chat-input">
                <div className="rn-direct-chat-input-mat">
                    <input
                        type="text"
                        placeholder="Type a message..."
                        className="rn-direct-chat-input-mat-field definp"
                        ref={ ref => this.matRef = ref }
                        onKeyDown={ ({ keyCode, target }) => (keyCode !== 13) ? null : this.sendMessage("DEFAULT", target.value, true) }
                    />
                    <div className="rn-direct-chat-input-mat-media">
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={ ({ target: { files: [file] } }) => (file) ? this.sendMessage("IMAGE", file, false, true) : null }
                            id="rn-direct-chat-input-mat-media-imgfile"
                        />
                        <label htmlFor="rn-direct-chat-input-mat-media-imgfile" type={ this.props.type } className="rn-direct-chat-input-mat-media-btn definp">
                            <FontAwesomeIcon icon={ faImage } />
                        </label>
                        <ChatInputBtn
                            icon={ faHeart }
                            _onClick={() => {
                                this.sendMessage("LIKE", "");
                            }}
                        />
                        <ChatInputBtn
                            icon={ faPaperPlane }
                            _onClick={() => {
                                this.sendMessage("DEFAULT", this.matRef.value, true);
                            }}
                        />
                    </div>
                </div>
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
                                    name={ this.props.dialog.conv.getName }
                                    image={ api.storage + this.props.dialog.conv.avatar }
                                    messages={ this.props.dialog.messagesInt }
                                />
                                <ChatDisplay
                                    messages={ this.props.dialog.messages }
                                />
                                <ChatInput
                                    _onSubmit={ this.props.onSendMessage }
                                />
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

class Messenger extends Component {
    constructor(props) {
        super(props);

        this.state = {
            chat: null,
            conversations: null,
            isLoadingChat: false,
            isLoadingConversations: true
        }

        this.sendedMessages = 0; // I'm using this value as id for the submited messages.
        this.clientID = cookieControl.get("userid");
    }

    componentDidMount() {
        { // Load 'instant' chat
            const a = this.props.match.params.id;
            if(a) {
                this.loadDialog(a);
            }
        }

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
                            lastMessage {
                                content,
                                type
                            },
                            conv {
                                id,
                                avatar,
                                getName
                            }
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
                        messagesInt,
                        conv {
                            id,
                            avatar,
                            getName
                        },
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
            }), () => {
                window.history.pushState(null, null, `${ links["MESSENGER_PAGE"].absolute }/${ conversation.id }`)
            });
        })
    }

    sendMessage = ({ type, content, isFile }) => {
        if(!this.state.chat) return;

        const mockID = ++this.sendedMessages;

        this.setState(({ chat, chat: { messages } }) => ({
            chat: {
                ...chat,
                messages: [
                    ...messages,
                    {
                        id: mockID,
                        type,
                        time: (+new Date()).toString(),
                        content: (!isFile) ? content : null,
                        creator: {
                            id: this.clientID,
                            avatar: null
                        }
                    }
                ]
            }
        }));

        client.mutate({
            mutation: gql`
                mutation($isFile: Boolean, $conversationID: ID!, $type: String!, $content: Upload!) {
                    sendMessage(isFile: $isFile, conversationID: $conversationID, type: $type, content: $content) {
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
            `,
            variables: {
                type,
                content,
                conversationID: this.state.chat.id,
                isFile
            }
        }).then(({ data: { sendMessage } }) => {
            if(!sendMessage) return this.props.castError("We coudln't send your message. Please, try again.");

            const a = Array.from(this.state.chat.messages);
            a[a.findIndex(io => io.id === mockID)] = sendMessage;

            this.setState(({ chat }) => ({
                chat: {
                    ...chat,
                    messages: a
                }
            }));
        }).catch(console.error);
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
                    onSendMessage={ this.sendMessage }
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
)(Messenger);
