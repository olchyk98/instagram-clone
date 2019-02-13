import React, { Component } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch as faSearchSolid } from '@fortawesome/free-solid-svg-icons';

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
            </section>
        );
    }
}

export default Search;