import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './main.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';

class CommentInput extends Component {
    constructor(props) {
        super(props);

        this.state = {
            content: ""
        }

        this.matRef = React.createRef();
    }

    render() {
        return(
            <form className={ `gle-post-commentinput ${ (this.props.className) }` } onSubmit={(e) => {
                e.preventDefault();
                this.props.onSubmit(this.state.content);
                this.matRef.value = "";
                this.matRef.blur();
            }}>
                <input
                    className="gle-post-commentinput-mat definp"
                    type="text"
                    placeholder="Add a comment"
                    onChange={ ({ target: { value } }) => this.setState({ content: value }) }
                    ref={(ref) => {
                        if(this.props.onRef) this.props.onRef(ref);

                        this.matRef = ref;
                    }}
                />
                <div className="gle-post-commentinput-options">
                    <button type="button" className="definp gle-post-commentinput-options-btn" onClick={ this.props.callMenu }>
                        <FontAwesomeIcon icon={ faEllipsisH } />
                    </button>
                </div>
            </form>
        );
    }
}

CommentInput.propTypes = {
    callMenu: PropTypes.func.isRequired,
    className: PropTypes.string,
    onRef: PropTypes.func,
    onSubmit: PropTypes.func.isRequired
}

export default CommentInput;
