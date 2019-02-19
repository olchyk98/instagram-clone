import React, { PureComponent } from 'react';
import './main.css';

import { connect } from 'react-redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

class Hero extends PureComponent {
    render() {
        return(
            <div className={ `gle-glerror${ (!this.props.error) ? "" : " active" }` }>
                <section className="gle-glerror-info">
                    <p>{ this.props.error && this.props.error.text }</p>
                </section>
                <button className="gle-glerror-closebtn definp" onClick={ this.props.closeSelf }>
                    <FontAwesomeIcon icon={ faTimes } />
                </button>
            </div>
        );
    }
}

const mapStateToProps = ({ session: { globalError } }) => ({
    error: globalError
});

const mapActionsToProps = {
    closeSelf: () => ({ type: "CAST_GLOBAL_ERROR", payload: null })
}

export default connect(
    mapStateToProps,
    mapActionsToProps
)(Hero);
