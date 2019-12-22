import React, { Suspense } from 'react';
import Grid from '@material-ui/core/Grid';
import { fetcher } from 'api/backend';
import { fetcher as tmdbFetcher } from 'api/tmdb';
import useSWR from 'swr';
import { API, FE, baseFeUrl } from 'routes';
import { useParams } from 'react-router';
import Loading from 'components/Loading/Loading';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { tmdb } from 'routes';
import { useStores } from '../../stores/store';
import { observer } from 'mobx-react';
import Material from 'components/Tables/Material';

interface Props {}

const Detail: React.FC<Props> = props => {
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
      <Grid container spacing={4}>
        <Grid item xs={6}>
          {tmdbMovie ? (
            <img
              src={`${tmdb.image.base}${tmdbMovie.backdrop_path}`}
              alt="movie poster"
            />
          ) : (
            <Loading />
          )}
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h3">{movie.title}</Typography>
          <Box mt={2}>
            {tmdbMovie && tmdbMovie.overview && (
              <Typography>{tmdbMovie.overview}</Typography>
            )}
          </Box>
        </Grid>
      </Grid>
    );
  };

  return (
    <>
      <Suspense fallback={<Loading />}>{renderContent()}</Suspense>
    </>
  );
};

export default observer(Detail);
