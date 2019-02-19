import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import './main.css';

import { connect } from 'react-redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarker, faUserPlus, faPlus, faImage, faVideo, faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons';

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

class Media extends PureComponent {
    render() {
        return(
            <div className={ `gle-newpost-target-preview-image ${ (this.props.status) }` }>
                <div className="gle-newpost-target-preview-image-type">
                    <FontAwesomeIcon icon={ {image:faImage,video:faVideo}[this.props.type] || faImage } />
                </div>
                {
                    (this.props.type === "image") ? (
                        <img className="gle-newpost-target-preview-image-media" src={ this.props.source } alt="preview" />
                    ) : (this.props.type === "video") ? (
                        <video autoPlay muted loop className="gle-newpost-target-preview-image-media">
                            <source src={ this.props.soruce } type={ this.props.fullType } />
                            Please, update your browser.
                        </video>
                    ) : null
                }
            </div>
        );
    }
}

Media.propTypes = {
    status: PropTypes.string.isRequired
}

class Hero extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tagPeopleOpen: false,
            setPlaceOpen: false,
            scrollPos: 0,
            media: []
        }
    }

    moveScroll = a => this.setState(({ scrollPos: b }) => ({
        scrollPos: b + a
    }));

    setMedia = file => {
        let a = this.state.media;

        if(a[this.state.scrollPos]) {
            URL.revokeObjectURL(a[this.state.scrollPos].preview);
        }

        const type = (file.type.includes("image")) ? "image" : (
            (file.type.includes("video")) ? "video" : null
        );

        if(!type) return;

        a[this.state.scrollPos] = {
            preview: URL.createObjectURL(file),
            file: file,
            type,
            fullType: file.type
        }

        this.setState(() => ({
            media: a
        }));
    }

    render() {
        return(
            <div className={ `gle-newpost_container${ (!this.props.active) ? "" : " active" }` }>
                <div className="gle-newpost">
                    <h3 className="gle-newpost-title">Set up your post</h3>
                    <div className="gle-newpost-target">
                        <section className="gle-newpost-target-preview">
                            {
                                this.state.media.map(({ preview, type, fullType }, index) => {
                                    const a = this.state.scrollPos;

                                    return(
                                        <Media
                                            key={ index }
                                            source={ preview }
                                            type={ type }
                                            fullType={ fullType }
                                            status={
                                                (index < a) ? "old" : (
                                                    (index > a) ? "new" : "curr"
                                                )
                                            }
                                        />
                                    );
                                })
                            }
                            <div className="gle-newpost-target-preview-load">
                                <label htmlFor="gle-newpost-target-preview-load-fi" className="definp" onClick={ () => null }>
                                    <FontAwesomeIcon icon={ faPlus } />
                                </label>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*, video/*"
                                    id="gle-newpost-target-preview-load-fi"
                                    onChange={ ({ target: { files: [file] } }) => (file) ? this.setMedia(file) : null }
                                />
                            </div>
                            {
                                (this.state.media[this.state.scrollPos - 1]) ? (
                                    <button
                                        className="gle-newpost-target-preview-scroll-btn definp l"
                                        onClick={ () => this.moveScroll(-1) }>
                                        <FontAwesomeIcon icon={ faCaretLeft } />
                                    </button>
                                ) : null
                            }
                            {
                                (this.state.media[this.state.scrollPos]) ? (
                                    <button
                                        className="gle-newpost-target-preview-scroll-btn definp r"
                                        onClick={ () => this.moveScroll(1) }>
                                        <FontAwesomeIcon icon={ faCaretRight } />
                                    </button>
                                ) : null
                            }
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
