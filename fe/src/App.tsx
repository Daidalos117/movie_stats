import React, { Suspense, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  RouteComponentProps,
  RouteProps,
  Redirect
} from 'react-router-dom';

import { observer } from 'mobx-react';
import { FE } from './routes';
import { StylesProvider } from '@material-ui/core/styles';
import LoginPage from 'components/LoginPage/LoginPage';
import { useStores } from './stores/store';
import History from 'pages/History/History';
import HistoryDetail from 'pages/History/Detail';
import CssBaseline from '@material-ui/core/CssBaseline';
import LoggedApp from './components/LoggedApp/LoggedApp';

interface Match {
  token: string;
}

const App: React.FC = () => {
  const { userStore, apiStore } = useStores();
  const { fetchUser } = userStore;
  const { user } = userStore;
  const { token } = apiStore;

  useEffect(() => {
    if (token) {
      userStore.fetchUser();
    }
  }, [token]);

  const loginCallback = (props: RouteComponentProps<Match>) => {
    const { token } = props.match.params;
    apiStore.token = token;
    return <div />;
  };

  function PrivateRoute({ children, ...rest }: RouteProps) {
    return (
      <Route
        {...rest}
        render={({ location }) =>
          user ? (
            children
          ) : (
            <Redirect
              to={{
                pathname: '/login',
                state: { from: location }
              }}
            />
          )
        }
      />
    );
  }

  return (
    <Router>
      <StylesProvider injectFirst>
        <CssBaseline />
        <div className="App">
          <Switch>
            <Route path="/login">
              <LoginPage />
            </Route>

            <Route
              exact
              path={`${FE.auth.callback}/:token`}
              render={(props: RouteComponentProps<Match>) => {
                {
                  loginCallback(props);
                }
                return <div />;
              }}
            />

            <PrivateRoute path="/">
              <LoggedApp />
            </PrivateRoute>
          </Switch>
        </div>
      </StylesProvider>
    </Router>
  );
};

export default observer(App);
