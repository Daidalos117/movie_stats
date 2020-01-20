import React, { Suspense } from 'react';
import { FE } from 'routes';
import MovieHistory from 'pages/Movie/History';
import ShowHistory from 'pages/Show/History';
import MovieDetail from 'pages/Movie/Detail';
import ShowDetail from 'pages/Show/Detail';
import { Switch, Route } from 'react-router';
import Loading from 'components/Loading/Loading';
import Menu from 'components/Menu/Menu';
import Layout from 'components/Layout/Layout';

interface Props {}

const LoggedApp: React.FC<Props> = () => {
  return (
    <>
      <Menu />

      <Suspense fallback={<Loading />}>
        <Switch>
          <Route exact path={FE.index}>
            <Layout>
              <MovieHistory />
            </Layout>
          </Route>
          <Route exact path={`/${FE.movie.index}`}>
            <Layout>
              <MovieHistory />
            </Layout>
          </Route>
          <Route exact path={`/${FE.show.index}`}>
            <Layout>
              <ShowHistory />
            </Layout>
          </Route>

          <Route exact path={`/${FE.movie.index}/:id`}>
            <MovieDetail />
          </Route>

          <Route exact path={`/${FE.show.index}/:id`}>
            <ShowDetail />
          </Route>
        </Switch>
      </Suspense>
    </>
  );
};

export default LoggedApp;
