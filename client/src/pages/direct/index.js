import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import './main.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faVideo } from '@fortawesome/free-solid-svg-icons';
import { faImage, faHeart, faPaperPlane } from '@fortawesome/free-regular-svg-icons';

const avatar = "https://i.ytimg.com/vi/SfLV8hD7zX4/maxresdefault.jpg";

class ConversationsItem extends PureComponent {
    render() {
        return(
            <article className="rn-direct-conversations-item">
                <div className="rn-direct-conversations-item-avatar">
                    <img src={ avatar } alt="user" />
                </div>
                <div className="rn-direct-conversations-item-info">
                    <span className="rn-direct-conversations-item-info-name">
                        Oles Odynets
                    </span>
                    <span className="rn-direct-conversations-item-info-last">
                        Hello, World!
                    </span>
                </div>
            </article>
        );
    }
}

class ConversationsSearch extends Component {
    render() {
        return(
            <div className="rn-direct-conversations-search">
                <div className="rn-direct-conversations-search-icon">
                    <FontAwesomeIcon icon={ faSearch } />
                </div>
                <input
                    type="text"
                    placeholder="Search"
                    className="rn-direct-conversations-search-field definp"
                />
            </div>
        );
    }
}

class Conversations extends Component {
    render() {
        return(
            <section className="rn-direct-conversations">
                <ConversationsSearch />
                <div className="rn-direct-conversations-mat">
                    <ConversationsItem />
                    <ConversationsItem />
                    <ConversationsItem />
                    <ConversationsItem />
                    <ConversationsItem />
                    <ConversationsItem />
                    <ConversationsItem />
                </div>
            </section>
        );
    }
}

class ChatHeaderBtn extends PureComponent {
    render() {
        return(
            <button className="definp rn-direct-chat-header-controls-item">
                <FontAwesomeIcon icon={ faVideo } />
            </button>
        );
    }
}

class ChatHeader extends PureComponent {
    render() {
        return(
            <header className="rn-direct-chat-header">
                <section className="rn-direct-chat-header-info">
                    <div className="rn-direct-chat-header-info-avatar">
                        <img src={ avatar } alt="user" />
                    </div>
                    <div className="rn-direct-chat-header-info-mat">
                        <span className="rn-direct-chat-header-info-mat-name">
                            Oles Odynets
                        </span>
                        <span className="rn-direct-chat-header-info-mat-messages">
                            14149 messages
                        </span>
                    </div>
                </section>
                <section className="rn-direct-chat-header-controls">
                    <ChatHeaderBtn />
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
                        <img src={ avatar } alt="user" />
                    </div>
                    <div className="rn-direct-chat-display-message-content">
                        <div className="rn-direct-chat-display-message-content-blank">
                            <span>
                                sad
                            </span>
                        </div>
                        <div className="rn-direct-chat-display-message-content-details">
                            <span>23:32</span>
                        </div>
                    </div>
                </article>
            </div>
        );
    }
}

ChatDisplayMessage.propTypes = {
    byClient: PropTypes.bool.isRequired
}

class ChatDisplay extends Component {
    render() {
        return(
            <div className="rn-direct-chat-display">
                <ChatDisplayMessage
                    byClient={ false }
                />
                <ChatDisplayMessage
                    byClient={ true }
                />
                <ChatDisplayMessage
                    byClient={ false }
                />
                <ChatDisplayMessage
                    byClient={ false }
                />
                <ChatDisplayMessage
                    byClient={ false }
                />
                <ChatDisplayMessage
                    byClient={ false }
                />
                <ChatDisplayMessage
                    byClient={ true }
                />
            </div>
        );
    }
}

class ChatInputBtn extends Component {
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
                <ChatHeader />
                <ChatDisplay />
                <ChatInput />
            </section>
        );
    }
}

class Hero extends Component {
    render() {
        return(
            <div className="rn rn-direct">
                <Conversations />
                <Chat />
            </div>
        );
    }
}

export default Hero;
