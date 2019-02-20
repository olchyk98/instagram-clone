import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import './main.css';

import { connect } from 'react-redux';
import { gql } from 'apollo-boost';

import client from '../../../apollo';
import api from '../../../api';

import FlipMove from 'react-flip-move';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarker, faUserPlus, faPlus, faImage, faVideo, faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons';

import loadingSpinner from '../loadingico.gif';

class DataInstructorItem extends PureComponent {
    render() {
        return(
            <span className="gle-newpost-target-data-instructor-item">{ this.props.name }</span>
        );
    }
}

DataInstructorItem.propTypes = {
    name: PropTypes.string.isRequired
}

class DataInstructor extends Component {
    render() {
        return(
            <FlipMove enterAnimation="fade" leaveAnimation="fade" className="gle-newpost-target-data-instructor" placeholder={ this.props._placeholder }>
                { this.props.children }
            </FlipMove>
        );
    }
}

DataInstructor.propTypes = {
    _placeholder: PropTypes.string.isRequired
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
                            <source src={ this.props.source } type={ this.props.fullType } />
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

class TagPeopleItem extends PureComponent {
    render() {
        return(
            <article className={ `gle-newpost-target-preview-controls-container-people-list-item${ (!this.props.active) ? "" : " active" }` } onClick={ this.props.onSelect }>
                <div className="gle-newpost-target-preview-controls-container-people-list-item-avatar">
                    <img alt="user" src={ api.storage + this.props.avatar } />
                </div>
                <span className="gle-newpost-target-preview-controls-container-people-list-item-name">
                    { this.props.name }
                </span>
            </article>
        );
    }
}

TagPeopleItem.propTypes = {
    avatar: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    active: PropTypes.bool.isRequired,
    onSelect: PropTypes.func.isRequired
}

class Hero extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tagPeopleOpen: false,
            setPlaceOpen: false,
            scrollPos: 0,
            description: "",
            media: [],
            people: [], // { id, name, login }
            searchPeople: [],
            searchingPeople: false,
            places: []
        }

        this.placeInputRef = React.createRef();
    }

    moveScroll = a => this.setState(({ scrollPos: b }) => ({
        scrollPos: b + a
    }));

    setMedia = file => {
        let a = Array.from(this.state.media);

        if(a[this.state.scrollPos]) {
            URL.revokeObjectURL(a[this.state.scrollPos].preview);
        }

        const type = (file.type.includes("image")) ? "image" : (
            (file.type.includes("video")) ? "video" : null
        );

        if(!type) return;

        /*
            I understood that there are few video types that uses an other processing method.
            For example video that was recorded in MACOS
            and  was saved in QuickTime format should be processed as mp4 file.

            As I understand, people who are working with Google (YouTube) made a very big job,
            because there are no browsers that can support even .avi video files. It's sad.
            Now I understand why YouTube converts every video into another file format.

            UPD: I just limited i-formats.
            The file input can accept only Quicktime and MP4 videos now.
        */
        const forkTypes = {
            "video/quicktime": "video/mp4"
        }

        a[this.state.scrollPos] = {
            preview: URL.createObjectURL(file),
            file: file,
            type,
            fullType: forkTypes[file.type] || file.type
        }

        this.setState(() => ({
            media: a
        }));
    }

    searchPeople = query => {
        this.setState(() => ({
            searchingPeople: true
        }));

        client.query({
            query: gql`
                query($query: String!) {
                    searchPeople(query: $query) {
                        id,
                        name,
                        login,
                        avatar
                    }
                }
            `,
            variables: {
                query
            }
        }).then(({ data: { searchPeople } }) => {
            this.setState(() => ({
                searchingPeople: false
            }));

            if(!searchPeople) return;

            this.setState(() => ({
                searchPeople
            }));
        }).catch(console.error);
    }

    togglePeople = (id, data) => {
        const a = Array.from(this.state.people),
              b = a.map(io => io.id).findIndex(io => io === id)
        if(b === -1) {
            a.push(data);
        } else {
            a.splice(b, 1);
        }

        this.setState(() => ({
            people: a
        }));
    }

    submitPost = () => {
        // TODO: Show spinner
        // TOOD: Make original Instagram notififier

        const { description, media, people, places } = this.state;

        // Post
        client.mutate({
            mutation: gql`
                mutation($text: String!, $places: [String!], $people: [ID!], $media: [Upload!]!) {
                    createPost(text: $text, places: $places, people: $people, media: $media) {
                        id
                    }
                }
            `,
            variables: {
                text: description,
                places,
                people: people.map(io => io.id),
                media: media.map(io => io.file)
            }
        }).then(({ data: { createPost } }) => {
            if(!createPost) return this.props.castError("Something went wrong. Please, try again.");

            // TODO: Disable spinner
            // TODO: Clear data
            // Close modal
            this.props.closeSelf();
        }).catch(console.error);

        this.props.closeSelf();
    }

    render() {
        return(
            <div className={ `gle-newpost_container${ (!this.props.active) ? "" : " active" }` }>
                <div className="gle-newpost">
                    <h3 className="gle-newpost-title">Set up your post</h3>
                    <div className="gle-newpost-target">
                        <section className="gle-newpost-target-preview">
                            <div className="gle-newpost-target-preview-mat">
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
                            </div>
                            <div className="gle-newpost-target-preview-load">
                                <label htmlFor="gle-newpost-target-preview-load-fi" className="definp" onClick={ () => null }>
                                    <FontAwesomeIcon icon={ faPlus } />
                                </label>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*, video/quicktime, video/mp4"
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
                                        <div className="gle-newpost-target-preview-controls-container-people-list">
                                            {
                                                (!this.state.searchingPeople) ? (
                                                    (() => {
                                                        const a = this.state.people.map(io => io.id);

                                                        return this.state.searchPeople.map(({ id, avatar, name, login }, index) => (
                                                            <TagPeopleItem
                                                                key={ id }
                                                                name={ name || login }
                                                                avatar={ avatar }
                                                                active={ a.includes(id) }
                                                                onSelect={ () => this.togglePeople(id, { id, login, name }) }
                                                            />
                                                        ));
                                                    })()
                                                ) : (
                                                    <img src={ loadingSpinner } alt="loading spinner" className="gle-newpost-target-preview-controls-container-people-list-loading" />
                                                )
                                            }
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Search..."
                                            onChange={({ target }) => {
                                                clearTimeout(target.searchINT);
                                                target.searchINT = setTimeout(() => this.searchPeople(target.value), 400);
                                            }}
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
                                            ref={ ref => this.placeInputRef = ref }
                                        />
                                        <button
                                            className="gle-newpost-target-preview-controls-container-location-submit definp submit"
                                            onClick={() => {
                                                const a = this.placeInputRef;

                                                a.focus();

                                                if(!a.value.replace(/\s|\n/g, "").length) return;

                                                let b = Array.from(this.state.places);
                                                b.push(a.value);

                                                this.setState(() => ({
                                                    places: b
                                                }), () => a.value = "");
                                            }}>
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
                                onChange={ ({ target: { value: a } }) => this.setState({ description: a }) }
                            />
                            <DataInstructor _placeholder="People which you might tag will appear here...">
                                {
                                    this.state.people.map(({ name, login, id }) => (
                                        <DataInstructorItem
                                            key={ id }
                                            name={ (name && `${ name } (${ login })`) || login }
                                        />
                                    ))
                                }
                            </DataInstructor>
                            <DataInstructor _placeholder="Places which you might tag will appear here...">
                                {
                                    this.state.places.map((session, index) => (
                                        <DataInstructorItem
                                            key={ index }
                                            name={ session }
                                        />
                                    ))
                                }
                            </DataInstructor>
                        </section>
                    </div>
                    <div className="gle-newpost-controls">
                        <button className="gle-newpost-controls-btn definp" onClick={ this.props.closeSelf }>
                            Discard
                        </button>
                        <button className="gle-newpost-controls-btn definp dark" disabled={ this.state.media.length === 0 } onClick={ this.submitPost }>
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
    closeSelf: () => ({ type: "CREATE_NEW_POST", payload: false }),
    castError: text => ({ type: "CAST_GLOBAL_ERROR", payload: { text } })
}

export default connect(
    mapStateToProps,
    mapActionsToProps
)(Hero);
