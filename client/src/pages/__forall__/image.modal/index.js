import React, { Component } from 'react';
import './main.css';

class Hero extends Component {
    render() {
        return(
            <>
                <div className="gle-imagemodalbg" />
                <div className="gle-imagemodal">
                    <div className="gle-imagemodal-mat">
                        <section className="gle-imagemodal-mat-image">
                            {/* TODO: Use height and max width to make adaptive width */}
                        </section>
                        <section className="gle-imagemodal-mat-info">
                            
                        </section>
                    </div>
                </div>
            </>
        );
    }
}

export default Hero;