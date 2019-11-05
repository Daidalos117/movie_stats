import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  RouteComponentProps
} from 'react-router-dom';

import { observer } from 'mobx-react';
import { FE } from './routes';
import { StylesProvider } from '@material-ui/core/styles';
import LoginPage from 'components/LoginPage/LoginPage';
import { useStores } from './stores/store';
import LoggedApp from 'components/App/App';

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
    props.history.push('/');
    return <div />;
  };

  return (
    <Router>
      <StylesProvider injectFirst>
        <div className="App">
          <Switch>
            <Route exact path={FE.index}>
              {!user ? <LoginPage /> : <LoggedApp />}
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
          </Switch>
        </div>
      </StylesProvider>
    </Router>
  );
};

export default observer(App);
