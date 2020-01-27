import React, { Suspense, useEffect } from 'react';
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
import { RestOfPage } from './styled';
import Layout from 'components/Layout/Layout';
import DocumentHeader from 'components/DocumentHeader/DocumentHeader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { Episode, History } from 'stores/ShowsStore';
import { fromISO } from 'helpers/formatDate';
import Season from 'components/Show/Season';
import IconButton from '@material-ui/core/IconButton/IconButton';
import ArrowBack from '@material-ui/icons/ArrowBack';

interface Props {}

interface OpenedSeasonsState {
  [key: string]: boolean;
}

const Detail: React.FC<Props> = () => {
  let { id } = useParams();
  const { uiStore, showsStore } = useStores();
  const {
    openSeason,
    openedEpisodes,
    addOpenEpisode,
    removeOpenEpisode
  } = showsStore;
  uiStore.menuBack = `/${FE.show.index}`;

  const { data: show, error } = useSWR(
    `${API.show.index}/${id}`,
    (url: string) => fetcher(url, {}),
    { suspense: true, revalidateOnFocus: false }
  );

  const { data: tmdbShow, error: tmdbError } = useSWR(
    () => `/tv/${show.ids.tmdb}`,
    tmdbFetcher,
    { revalidateOnFocus: false }
  );
  const { episodes, seasons } = show;

  if (tmdbError) console.error(tmdbError);

  useEffect(() => {
    // different episode
    showsStore.openSeason = null;
  }, [showsStore, id]);

  const renderSeasons = () => {
    if (openSeason) {
      const season = seasons[openSeason];
      return (
        <>
          <IconButton edge="start" color="inherit" aria-label="back" onClick={() => {
            showsStore.openSeason = null;
          }}>
            <ArrowBack />
          </IconButton>

          <List component="nav" aria-labelledby="list">
            {season &&
              season.map((episode: Episode | null) => {
                if (!episode) return;
                const { number: episodeNumber, title } = episode;
                return (
                  <div key={episodeNumber}>
                    <ListItem
                      button
                      onClick={() => {
                        addOpenEpisode(episodeNumber);
                      }}
                    >
                      <ListItemText
                        primary={`${episodeNumber}`}
                        secondary={title}
                      />
                      {openedEpisodes.includes(episodeNumber) ? (
                        <ExpandLess />
                      ) : (
                        <ExpandMore />
                      )}
                    </ListItem>

                    <Collapse
                      in={openedEpisodes.includes(episodeNumber)}
                      timeout="auto"
                      unmountOnExit
                    >
                      <List component="div" disablePadding>
                        {episode.histories.map((history: History) => {
                          const { watched_at } = history;
                          return (
                            <ListItem button key={watched_at}>
                              <ListItemText
                                primary={fromISO(watched_at).toFormat(
                                  'dd.M.yyyy HH:mm'
                                )}
                              />
                            </ListItem>
                          );
                        })}
                      </List>
                    </Collapse>
                  </div>
                );
              })}
          </List>
        </>
      );
    } else {
      return (
        <List component="nav" aria-labelledby="list">
          {Object.keys(seasons).map((seasonNumber: string) => (
            <Season
              seasonNumber={parseInt(seasonNumber)}
              showId={tmdbShow && tmdbShow.id}
              key={seasonNumber}
              onClick={() => {
                showsStore.openSeason = seasonNumber;
              }}
            />
          ))}
        </List>
      );
    }
  };

  const renderContent = () => {
    if (!show) {
      return <Loading />;
    }

    return (
      <>
        {tmdbShow && (
          <DocumentHeader
            title={show.title}
            backdropPath={tmdbShow && tmdbShow.backdrop_path}
            id={tmdbShow && tmdbShow.id}
            tmdbLink={`https://www.themoviedb.org/tv/${show.ids.tmdb}`}
            imdbLink={`https://www.imdb.com/title/${show.ids.imdb}`}
            voteAverage={tmdbShow && tmdbShow.vote_average}
            genres={tmdbShow && tmdbShow.genres}
            menuBack={`/${FE.show.index}`}
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
                {renderSeasons()}
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
