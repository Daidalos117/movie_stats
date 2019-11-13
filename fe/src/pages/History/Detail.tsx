import React, { Suspense } from 'react';
import Grid from '@material-ui/core/Grid';
import { fetcher } from 'api/backend';
import { fetcher as tmdbFetcher } from 'api/tmdb';
import useSWR from 'swr';
import { API } from 'routes';
import { useParams } from 'react-router';
import Loading from 'components/Loading/Loading';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { tmdb } from 'routes';

interface Props {}

const Detail: React.FC<Props> = props => {
  let { id } = useParams();
  const { data: movie, error } = useSWR(
    `${API.movie.index}/${id}`,
    (url: string) => fetcher(url, {}),
    { suspense: true }
  );
  const { data: tmdbMovie } = useSWR(
    () => `/movie/${movie.ids.tmdb}`,
    tmdbFetcher
  );

  const renderContent = () => {
    if (!movie) {
      return <Loading />;
    }

    console.log(process.env);
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
          {tmdbMovie && tmdbMovie.overview && <Typography>{tmdbMovie.overview}</Typography>}
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

export default Detail;
