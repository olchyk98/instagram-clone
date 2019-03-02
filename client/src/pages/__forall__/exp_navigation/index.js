import React, { PureComponent } from 'react';
import './main.css';

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import links from '../../../links';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import instagram_logo from './images/logo_bw.png';

class Hero extends PureComponent {
	render() {
		return(
			<div className="gle-explosure_nav">
				<Link className="gl-nav-routes-btn expl definp" title="Move to feed" to={ links["FEED_PAGE"].absolute }>
                    <img className="gl-nav-logo-bw" src={ instagram_logo } alt="black white instagram logo" />
                </Link>
                <button className="gl-nav-routes-btn expl definp" title="Add a new post" onClick={ this.props.createPost }>
                    <FontAwesomeIcon icon={ faPlus } />
                </button>
			</div>
		);
	}
}

const mapStateToProps = () => ({});

const mapActionsToProps = {
	createPost: () => ({ type: "CREATE_NEW_POST", payload: true })
}

export default connect(
	mapStateToProps,
	mapActionsToProps	
)(Hero);