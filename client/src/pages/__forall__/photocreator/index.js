import React, { Component, PureComponent } from 'react';
import './main.css';

import { connect } from 'react-redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarker, faUserPlus, faPlus } from '@fortawesome/free-solid-svg-icons';

const image = "https://scontent-arn2-1.cdninstagram.com/vp/0a7093bc1183ffe944e0b05a5e5feecd/5CE06CFB/t51.2885-15/e35/51725722_811239225875013_2879130140697820953_n.jpg?_nc_ht=scontent-arn2-1.cdninstagram.com";

class DataInstructorItem extends PureComponent {
    render() {
        return(
            <span className="gle-newpost-target-data-instructor-item">@oles.odynets</span>
        );
    }
}

class DataInstructor extends PureComponent {
    render() {
        return(
            <div className="gle-newpost-target-data-instructor">
                <DataInstructorItem />
            </div>
        );
    }
}

class Hero extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tagPeopleOpen: false,
            setPlaceOpen: false
        }
    }

    render() {
        return(
            <div className={ `gle-newpost_container${ (!this.props.active) ? "" : " active" }` }>
                <div className="gle-newpost">
                    <h3 className="gle-newpost-title">Set up your post</h3>
                    <div className="gle-newpost-target">
                        <section className="gle-newpost-target-preview">
                            <img className="gle-newpost-target-preview-image" src={ image } alt="preview" />
                            <div className="gle-newpost-target-preview-load">
                                <label className="definp" onClick={ () => null }>
                                    <FontAwesomeIcon icon={ faPlus } />
                                </label>
                            </div>
                            <div className="gle-newpost-target-preview-controls">
                                <div className="gle-newpost-target-preview-controls-container">
                                    <div className={ `gle-newpost-target-preview-controls-container-win gle-newpost-target-preview-controls-container-people${ (!this.state.tagPeopleOpen) ? "" : " active" }` }>
                                        <div className="gle-newpost-target-preview-controls-container-people-list"></div>
                                        <input
                                            type="text"
                                            placeholder="Search..."
                                            className="gle-newpost-target-preview-controls-container-win-input definp"
                                        />
                                    </div>
                                    <button
                                        title="Tag people"
                                        onClick={ () => this.setState(({ tagPeopleOpen: a }) => ({ tagPeopleOpen: !a })) }
                                        className="definp gle-newpost-target-preview-controls-btn">
                                        <FontAwesomeIcon icon={ faUserPlus } />
                                    </button>
                                </div>
                                <div className="gle-newpost-target-preview-controls-container">
                                    <div className={ `gle-newpost-target-preview-controls-container-win gle-newpost-target-preview-controls-container-location${ (!this.state.setPlaceOpen) ? "" : " active" }` }>
                                        <input
                                            type="text"
                                            placeholder="Type place..."
                                            className="gle-newpost-target-preview-controls-container-win-input definp"
                                        />
                                        <button className="gle-newpost-target-preview-controls-container-location-submit definp submit">
                                            Submit
                                        </button>
                                    </div>
                                    <button
                                        title="Add location"
                                        onClick={ () => this.setState(({ setPlaceOpen: a }) => ({ setPlaceOpen: !a })) }
                                        className="definp gle-newpost-target-preview-controls-btn">
                                        <FontAwesomeIcon icon={ faMapMarker } />
                                    </button>
                                </div>
                            </div>
                        </section>
                        <section className="gle-newpost-target-data">
                            <textarea
                                className="gle-newpost-target-data-description definp"
                                placeholder="Your description here..."
                            />
                            <DataInstructor />
                            <DataInstructor />
                        </section>
                    </div>
                    <div className="gle-newpost-controls">
                        <button className="gle-newpost-controls-btn definp" onClick={ this.props.closeSelf }>
                            Discard
                        </button>
                        <button className="gle-newpost-controls-btn definp dark">
                            Post
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({ session: { newPostWin } }) => ({
    active: !!newPostWin
});

const mapActionsToProps = {
    closeSelf: () => ({ type: "CREATE_NEW_POST", payload: false })
}

export default connect(
    mapStateToProps,
    mapActionsToProps
)(Hero);
