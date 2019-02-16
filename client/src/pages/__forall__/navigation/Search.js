import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch as faSearchSolid } from '@fortawesome/free-solid-svg-icons';

const image = "https://d1ia71hq4oe7pn.cloudfront.net/og/75335251-1200px.jpg";

class SearchResultItem extends PureComponent {
    render() {
        return(
            <article className="gl-nav-search-results-item">
                <section className="gl-nav-search-results-item-image">
                    {/* <img className="gl-nav-search-results-item-image-mat" src={ image } alt="rev" /> */}
                    <span className="gl-nav-search-results-item-image-hashtag" />
                </section>
                <section className="gl-nav-search-results-item-info">
                    <span className="gl-nav-search-results-item-info-name">oles.odynets</span>
                    <span className="gl-nav-search-results-item-info-more">
                        Oles Odynets
                        {/* name if user and number of posts if it's tag */}
                    </span>
                </section>
            </article>
        );
    }
}

class SearchResults extends PureComponent {
    render() {
        return(
            <div className={ `gl-nav-search-results${ (!this.props.active) ? "" : " active" }` }>
                <div className="gl-nav-search-results-list">
                    <SearchResultItem />
                    <SearchResultItem />
                    <SearchResultItem />
                    <SearchResultItem />
                    <SearchResultItem />
                    <SearchResultItem />
                    <SearchResultItem />
                    <SearchResultItem />
                    <SearchResultItem />
                    <SearchResultItem />
                </div>
            </div>
        );
    }
}

SearchResults.propTypes = {
    active: PropTypes.bool.isRequired
}

class Search extends Component {
    constructor(props) {
        super(props);

        this.state = {
            inFocus: false,
            query: ""
        }
    }

    render() {
        return(
            <section
                className="gl-nav-search"
                tabIndex="-1"
                onFocus={ () => this.setState({ inFocus: true }) }
                onBlur={ () => this.setState({ inFocus: false }) }>
                {
                    (!this.state.inFocus && !this.state.query) ? (
                        <div className="gl-nav-search-placeholder">
                            <FontAwesomeIcon icon={ faSearchSolid } />
                            <span>Search</span>
                        </div>
                    ) : (
                        <div className="gl-nav-search-mat">
                            <div className="gl-nav-search-mat-icon">
                                <FontAwesomeIcon icon={ faSearchSolid } />
                            </div>
                            <input
                                autoFocus={ true }
                                className="gl-nav-search-mat-input definp"
                                type="search"
                                placeholder="Search"
                                onChange={ ({ target: { value } }) => this.setState({ query: value }) }
                            />
                        </div>
                    )
                }
                <SearchResults
                    active={ !!(this.state.query && this.state.inFocus) }
                />
            </section>
        );
    }
}

export default Search;