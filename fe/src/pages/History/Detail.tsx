import React, { Suspense } from 'react';
import Grid from '@material-ui/core/Grid';
import {fetcher} from 'api/backend';
import { fetcher as tmdbFetcher } from 'api/tmdb';
import useSWR from 'swr';
import { API } from 'routes';
import { useParams } from 'react-router';
import Loading from 'components/Loading/Loading';
import Typography from '@material-ui/core/Typography';

interface Props {}

const Detail: React.FC<Props> = props => {
  let { id } = useParams();
  const { data: movie, error } = useSWR(
    `${API.movie.index}/${id}`,
    (url: string) => fetcher(url, {}),
    { suspense: true }
  );
  const { data: tmdbMovie } = useSWR(() => `/movie/${movie.ids.tmdb}`, tmdbFetcher)


  const renderContent = () => {
    if (!movie) {
      return <Loading />;
    }

    console.log(process.env);
    return (
      <Grid container>
        <Grid item xs={4}></Grid>
        <Grid item xs={8}>
          <Typography variant="h2">{movie.title}</Typography>
        </Grid>
      </Grid>
    );
  };

  return (
    <>
      <Suspense fallback={<Loading />}>
        <Grid container>
          <Grid item xs={6}>
            {renderContent()}
          </Grid>
        </Grid>
      </Suspense>
    </>
  );
};

export default Detail;
