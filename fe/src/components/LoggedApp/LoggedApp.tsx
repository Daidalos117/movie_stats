import React, { Suspense } from 'react';
import { FE } from 'routes';
import History from 'pages/History/History';
import HistoryDetail from 'pages/History/Detail';
import { Switch, Route } from 'react-router';
import Loading from 'components/Loading/Loading';
import Menu from 'components/Menu/Menu';
import Layout from 'components/Layout/Layout';

interface Props {}

const LoggedApp: React.FC<Props> = props => {
  return (
    <>
      <Menu />
      <Layout>
        <Suspense fallback={<Loading />}>
          <Switch>
            <Route exact path={FE.index}>
              <History />
            </Route>

            <Route exact path={`/${FE.movie.index}/:id`}>
              <HistoryDetail />
            </Route>
          </Switch>
        </Suspense>
      </Layout>
    </>
  );
};

export default LoggedApp;
