import React, { Suspense } from 'react';
import { FE } from 'routes';
import MovieHistory from 'pages/Movie/History';
import HistoryDetail from 'pages/Movie/Detail';
import { Switch, Route } from 'react-router';
import Loading from 'components/Loading/Loading';
import Menu from 'components/Menu/Menu';
import Layout from 'components/Layout/Layout';

interface Props {}

const LoggedApp: React.FC<Props> = () => {
  return (
    <>
      <Menu />
      <Layout>
        <Suspense fallback={<Loading />}>
          <Switch>
            <Route exact path={FE.index}>
              <MovieHistory />
            </Route>
            <Route exact path={`/${FE.movie.index}`}>
              <MovieHistory />
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
