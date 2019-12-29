import React, { Suspense } from 'react';
import Grid from '@material-ui/core/Grid';
import { fetcher } from 'api/backend';
import { fetcher as tmdbFetcher } from 'api/tmdb';
import useSWR from 'swr';
import { API, FE } from 'routes';
import { useParams } from 'react-router';
import Loading from 'components/Loading/Loading';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { tmdb } from 'routes';
import { useStores } from '../../stores/store';
import { observer } from 'mobx-react';
import MaterialTable from 'components/Tables/Material';
import { fromISO } from '../../helpers/formatDate';
import { RestOfPage } from './styled';
import Layout from 'components/Layout/Layout';
import DocumentHeader from 'components/DocumentHeader/DocumentHeader';

interface Props {}

const Detail: React.FC<Props> = () => {
  let { id } = useParams();
  const { uiStore } = useStores();
  const { data: movie, error } = useSWR(
    `${API.movie.index}/${id}`,
    (url: string) => fetcher(url, {}),
    { suspense: true }
  );
  const { data: tmdbMovie } = useSWR(
    () => `/movie/${movie.ids.tmdb}`,
    tmdbFetcher
  );

  uiStore.menuBack = `/${FE.movie.index}`;

  const renderContent = () => {
    if (!movie) {
      return <Loading />;
    }

    return (
      <>
        <DocumentHeader
          title={movie.title}
          backdropPath={tmdbMovie && tmdbMovie.backdrop_path}
          id={tmdbMovie && tmdbMovie.id}
          imdbId={tmdbMovie && tmdbMovie.imdb_id}
          voteAverage={tmdbMovie && tmdbMovie.vote_average}
          genres={tmdbMovie && tmdbMovie.genres}
          menuBack={`/${FE.movie.index}`}
        />

        <RestOfPage>
          <Layout>
            <Box mt={2}>
              {tmdbMovie && tmdbMovie.overview && (
                <Typography>{tmdbMovie.overview}</Typography>
              )}
            </Box>

            <Grid container spacing={4}>
              <Grid item xs={12}>
                <MaterialTable
                  columns={[
                    {
                      title: 'Date',
                      field: 'watched_at',
                      render: rowData =>
                        fromISO(rowData.watched_at).toFormat('dd.M.yyyy')
                    },
                    {
                      title: 'Time',
                      field: 'watched_at',
                      render: rowData =>
                        fromISO(rowData.watched_at).toFormat('HH:mm')
                    }
                  ]}
                  options={{
                    sorting: true
                  }}
                  data={movie.histories}
                />
              </Grid>
            </Grid>
          </Layout>
        </RestOfPage>
      </>
    );
  };

  return (
    <>
      <Suspense fallback={<Loading />}>{renderContent()}</Suspense>
    </>
  );
};

export default observer(Detail);
