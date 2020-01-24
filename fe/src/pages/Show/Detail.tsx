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
    `${API.show.index}/${id}`,
    (url: string) => fetcher(url, {}),
    { suspense: true }
  );

  const { data: tmdbShow, error: tmdbError } = useSWR(
    () => `/movie/${movie.ids.tmdb}`,
    tmdbFetcher
  );
  if(tmdbError) console.error(tmdbError);

  uiStore.menuBack = `/${FE.show.index}`;

  const renderContent = () => {
    if (!movie) {
      return <Loading />;
    }

    return (
      <>
        {tmdbShow && (
          <DocumentHeader
            title={movie.title}
            backdropPath={tmdbShow && tmdbShow.backdrop_path}
            id={tmdbShow && tmdbShow.id}
            imdbId={tmdbShow && tmdbShow.imdb_id}
            voteAverage={tmdbShow && tmdbShow.vote_average}
            genres={tmdbShow && tmdbShow.genres}
            menuBack={`/${FE.movie.index}`}
          />
        )}

        <RestOfPage>
          <Layout>
            <Box mt={2}>
              {tmdbShow && tmdbShow.overview && (
                <Typography>{tmdbShow.overview}</Typography>
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
