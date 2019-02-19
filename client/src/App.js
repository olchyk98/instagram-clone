import React, { Component } from 'react';

// Pages
import Feed from './pages/feed';
import Account from './pages/account';
import Settings from './pages/settings';
import Explore from './pages/explore';
import P404 from './pages/404';
import Direct from './pages/direct';
import Login from './pages/login';

// Stuff
import links from './links';
import Navigation from './pages/__forall__/navigation';
import MultiwindowMenu from './pages/__forall__/multiwindow.menu';
import PhotoModal from './pages/__forall__/image.modal';
import PhotoAppender from './pages/__forall__/postcreator';
import { cookieControl } from './utils';
import GlobalError from './pages/__forall__/global.error';

// Router
import { BrowserRouter } from 'react-router-dom';
import { Route, Switch } from 'react-router'

// Redux
import reducers from './reducers';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

const reduxStore = createStore(
  reducers,
  {},
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

//
const NeedleRoute = ({ path, condition, component: Component, redirect: Redirect, ...settings }) => (
	<Route
		path={ path }
		{ ...settings }
		component={ props => (condition) ? <Component { ...props } /> : <Redirect { ...props } to={ Redirect } /> }
	/>
);

class App extends Component {
    constructor(props) {
        super(props);

        this.clientID = cookieControl.get("userid");
    }

    render() {
        return(
            <Provider store={ reduxStore }>
                <BrowserRouter>
                    <>
                        <MultiwindowMenu />
                        <PhotoModal />
                        <PhotoAppender />
                        <GlobalError />
                        {
                            (this.clientID) ? (
                                <Navigation />
                            ) : null
                        }
                        <Switch>
                            <NeedleRoute
                                path={ links["FEED_PAGE"].route }
                                condition={ this.clientID }
                                component={ Feed }
                                redirect={ Login }
                                exact
                            />
                            <NeedleRoute
                                path={ links["ACCOUNT_PAGE"].route }
                                condition={ this.clientID }
                                component={ Account }
                                redirect={ Login }
                                exact
                            />
                            <NeedleRoute
                                path={ links["SETTINGS_PAGE"].route }
                                condition={ this.clientID }
                                component={ Settings }
                                redirect={ Login }
                                exact
                            />
                            <NeedleRoute
                                path={ links["EXPLORE_PAGE"].route }
                                condition={ this.clientID }
                                component={ Explore }
                                redirect={ Login }
                                exact
                            />
                            <NeedleRoute
                                path={ links["MESSENGER_PAGE"].route }
                                condition={ this.clientID }
                                component={ Direct }
                                redirect={ Login }
                                exact
                            />
                            <Route component={ P404 } />
                        </Switch>
                    </>
                </BrowserRouter>
            </Provider>
        );
    }
}

export default App;
