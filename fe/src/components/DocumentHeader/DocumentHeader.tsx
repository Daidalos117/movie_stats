import React from 'react';
import { tmdb } from '../../routes';
import Loading from '../Loading/Loading';
import Layout from '../Layout/Layout';
import Typography from '@material-ui/core/Typography/Typography';
import StarIcon from '@material-ui/icons/Star';
import {
  Header,
  BgImg,
  HeaderBg,
  HeadingContainer,
  HeadingMeta,
  BackLink
} from './styled';
import IconButton from '@material-ui/core/IconButton/IconButton';
import ArrowBack from '@material-ui/icons/ArrowBack';
import RemoveRedEye from '@material-ui/icons/RemoveRedEye';

interface Props {
  backdropPath?: string | unknown;
  title: string;
  id?: string;
  imdbLink?: string;
  tmdbLink?: string;
  voteAverage?: number;
  genres?: string[];
  menuBack?: string;
  seenCount?: number;
}

const DocumentHeader: React.FC<Props> = ({
  backdropPath,
  title,
  id,
  imdbLink,
  tmdbLink,
  voteAverage,
  genres,
  menuBack,
  seenCount
}) => {
  return (
    <div>
      <Header>
        {backdropPath ? (
          <BgImg src={`${tmdb.image.base}${backdropPath}`} alt="movie poster" />
        ) : (
          <Loading />
        )}
        <HeaderBg />

        <Layout>
          {menuBack && (
            <BackLink to={menuBack}>
              <IconButton edge="start" color="inherit" aria-label="back">
                <ArrowBack />
              </IconButton>
            </BackLink>
          )}
          <HeadingContainer>
            <Typography variant="h2">{title}</Typography>

            <HeadingMeta>
              {genres && (
                <span>{genres.map((genre: any) => genre.name).join(', ')}</span>
              )}

              {voteAverage && (
                <span>
                  <StarIcon
                    color="primary"
                    fontSize="inherit"
                    className="star-icon"
                  />
                  {voteAverage}
                </span>
              )}

              {seenCount && (
                <span>
                  <RemoveRedEye fontSize="inherit" />
                  &nbsp;
                  {seenCount}x
                </span>
              )}

              {tmdbLink && (
                <span>
                  <a href={tmdbLink} target="_blank" rel="noopener noreferrer">
                    TMDB
                  </a>
                </span>
              )}

              {imdbLink && (
                <span>
                  <a href={imdbLink} target="_blank" rel="noopener noreferrer">
                    IMDB
                  </a>
                </span>
              )}
            </HeadingMeta>
          </HeadingContainer>
        </Layout>
      </Header>
    </div>
  );
};

export default DocumentHeader;
