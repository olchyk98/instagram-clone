import React, { Component } from 'react';

// Pages
import Feed from './pages/feed';

// Stuff
import links from './links';
import Navigation from './pages/__forall__/navigation';

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
    render() {
        return(
            <Provider store={ reduxStore }>
                <BrowserRouter>
                    <>
                        <Navigation />
                        <Switch>
                            <NeedleRoute
                                path={ links["FEED_PAGE"].route }
                                condition={ true }
                                component={ Feed }
                                redirect={ Feed }
                                exact
                            />
                        </Switch>
                    </>
                </BrowserRouter>
            </Provider>
        );
    }
}

export default App;