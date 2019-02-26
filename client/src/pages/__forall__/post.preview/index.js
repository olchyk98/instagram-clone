import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './main.css';

import { connect } from 'react-redux';

import api from '../../../api';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLayerGroup, faComment, faHeart } from '@fortawesome/free-solid-svg-icons';

class PostPreview extends Component {
    constructor(props) {
        super(props);

        this.state = {
            videoRunning: false
        }

        this.videoRef = (props.preview.type !== "video") ? null : React.createRef();
    }

    componentDidMount() {
        this.updateVideoPlayer();
    }

    componentDidUpdate() {
        this.updateVideoPlayer();
    }

    updateVideoPlayer = () => {
        if(!this.videoRef) return;

        if(this.state.videoRunning) this.videoRef.play();
        else this.videoRef.pause();
    }

    playVideo = a => (!this.videoRef) ? null : (a) ? this.videoRef.play() : this.videoRef.pause();

    render() {
        return(
            <article
                className="rn-account-posts-item"
                title="Open photo"
                onMouseEnter={ () => this.setState({ videoRunning: true }) }
                onMouseLeave={ () => this.setState({ videoRunning: false }) }
                onClick={ () => this.props.openPhotoModal(this.props.id) }>
                <div className="rn-account-posts-item-hover">
                    <div className="rn-account-posts-item-hover-stats">
                        <div>
                            <FontAwesomeIcon icon={ faHeart } />
                        </div>
                        <span>{ this.props.likesInt }</span>
                    </div>
                    <div className="rn-account-posts-item-hover-stats">
                        <div>
                            <FontAwesomeIcon icon={ faComment } />
                        </div>
                        <span>{ this.props.commentsInt }</span>
                    </div>
                </div>
                <div className="rn-account-posts-item-marks">
                    {
                        (!this.props.isMultimedia) ? null : (
                            <span className="rn-account-posts-item-marks-item">
                                <FontAwesomeIcon icon={ faLayerGroup } />
                            </span>
                        )
                    }
                </div>
                {
                    (this.props.preview.type === "image") ? (
                         <img className="rn-account-posts-item-preview" alt="preview"
                            src={ api.storage + this.props.preview.url }
                        />
                    ) : (
                        <video className="rn-account-posts-item-preview" autoPlay muted loop ref={ ref => this.videoRef = ref }>
                            <source src={ api.storage + this.props.preview.url } type="video/mp4" />
                            Please, update your browser.
                        </video>
                    )
                }
            </article>
        );
    }
}

PostPreview.propTypes = {
    id: PropTypes.string.isRequired,
    isMultimedia: PropTypes.bool.isRequired,
    likesInt: PropTypes.number.isRequired,
    commentsInt: PropTypes.number.isRequired,
    preview: PropTypes.shape({ // object
        id: PropTypes.string,
        type: PropTypes.string,
        url: PropTypes.string
    })
}

const mapStateToProps = () => ({});

const mapActionsToProps = {
    openPhotoModal: id => ({ type: 'PREVIEW_FLOAT_MODAL', payload: { id } })
}

export default connect(
    mapStateToProps,
    mapActionsToProps
)(PostPreview);
