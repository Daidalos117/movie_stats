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
import {
  BgImg,
  Header,
  HeaderBg,
  HeadingContainer,
  HeadingMeta,
  RestOfPage
} from './styled';
import Layout from 'components/Layout/Layout';
import StarIcon from '@material-ui/icons/Star';

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
  console.log(tmdbMovie);
  const renderContent = () => {
    if (!movie) {
      return <Loading />;
    }

    return (
      <>
        <Header>
          {tmdbMovie ? (
            <BgImg
              src={`${tmdb.image.base}${tmdbMovie.backdrop_path}`}
              alt="movie poster"
            />
          ) : (
            <Loading />
          )}
          <HeaderBg />
          <Layout>
            <HeadingContainer>
              <Typography variant="h2">{movie.title}</Typography>
              {tmdbMovie && (
                <HeadingMeta>
                  <span>
                    {tmdbMovie.genres
                      .map((genre: any) => genre.name)
                      .join(', ')}
                  </span>
                  <span>
                    <StarIcon color="primary" fontSize="inherit" className="star-icon" />
                    {tmdbMovie.vote_average}
                  </span>

                  <span>
                    <a
                      href={`https://www.themoviedb.org/movie/${tmdbMovie.id}`}
                      target="_blank"
                    >
                      TMDB
                    </a>
                  </span>
                  <span>
                    <a
                      href={`https://www.imdb.com/title/${tmdbMovie.imdb_id}`}
                      target="_blank"
                    >
                      IMDB
                    </a>
                  </span>
                </HeadingMeta>
              )}
            </HeadingContainer>
          </Layout>
        </Header>

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
