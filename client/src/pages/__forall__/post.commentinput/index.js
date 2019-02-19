import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './main.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';

class CommentInput extends Component {
    render() {
        return(
            <section className={ `gle-post-commentinput ${ (this.props.className) }` }>
                <input
                    className="gle-post-commentinput-mat definp"
                    type="text"
                    placeholder="Add a comment"
                    ref={ ref => (this.props.onRef) ? this.props.onRef(ref) : null }
                />
                <div className="gle-post-commentinput-options">
                    <button className="definp gle-post-commentinput-options-btn" onClick={ this.props.callMenu }>
                        <FontAwesomeIcon icon={ faEllipsisH } />
                    </button>
                </div>
            </section>
        );
    }
}

CommentInput.propTypes = {
    callMenu: PropTypes.func.isRequired,
    className: PropTypes.string,
    onRef: PropTypes.func
}

export default CommentInput;
