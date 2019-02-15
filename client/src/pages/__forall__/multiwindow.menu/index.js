import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import './main.css';

import { connect } from 'react-redux';

class Button extends PureComponent {
    render() {
        return(
            <button className={ `definp gle-multiwin_menu-btn${ (!this.props.isRed) ? "" : " red" }` } onClick={ this.props.action }>
                { this.props.text }
            </button>
        );
    }
}

Button.propTypes = {
    isRed: PropTypes.bool,
    action: PropTypes.func.isRequired,
    text: PropTypes.string.isRequired
}

class Hero extends PureComponent {
    render() {
        return(
            <>
                <div                    
                    className={ `gle-multiwin_menubg${ (!this.props.menu) ? "" : " active" }` }
                    onClick={ this.props.destroySelf }
                />
                <div className="gle-multiwin_menu">
                    {
                        (!this.props.menu) ? null : (
                            this.props.menu.buttons.map(({ isRed, action, text }, index) => (
                                <Button
                                    key={ index }
                                    isRed={ isRed }
                                    action={ action }
                                    text={ text }
                                />
                            ))
                        )
                    }
                </div>
            </>
        );
    }
}

const mapStateToProps = ({ session: { multiwinMenu } }) => ({
    menu: multiwinMenu
});

const mapActionsToProps = {
    destroySelf: () => ({ type: "SET_GLOBAL_MENU", payload: null })
}

export default connect(
    mapStateToProps,
    mapActionsToProps
)(Hero);