import React, { PureComponent } from 'react';
import './main.css';

import { connect } from 'react-redux';

import links from '../../links';

class PostPage extends PureComponent {
    componentDidMount() {
        let id = this.props.match.params.id;

        this.props.openModal({
            id,
            onClose: () => this.props.history.push(links["FEED_PAGE"].absolute)
        });
    }

    render() {
        return <div className="gle_v-postpage" />
    }
}

const mapStateToProps = () => ({});

const mapActionsToProps = {
    openModal: payload => ({ type: 'PREVIEW_FLOAT_MODAL', payload })
}

export default connect(
    mapStateToProps,
    mapActionsToProps
)(PostPage);