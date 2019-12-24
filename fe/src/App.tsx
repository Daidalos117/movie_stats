import React, { useEffect } from 'react';
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
import CssBaseline from '@material-ui/core/CssBaseline';
import LoggedApp from './components/LoggedApp/LoggedApp';
import CustomTheme from './components/CustomTheme/CustomTheme';
import './global.scss';

interface Match {
  token: string;
}

export const localStorageRedirectKey = 'redirect_after_login';

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
    props.history.push('/login');
    return <div />;
  };

  function PrivateRoute({ children, ...rest }: RouteProps) {
    if (!user && rest && rest.location) {
      localStorage.setItem(localStorageRedirectKey, rest.location.pathname);
    }

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
        <CustomTheme>
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
        </CustomTheme>
      </StylesProvider>
    </Router>
  );
};

export default observer(App);
