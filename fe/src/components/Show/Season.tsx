import React from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import useSWR from 'swr';
import { fetcher as tmdbFetcher } from '../../api/tmdb';
import { tmdb } from '../../routes';
import { BgImg } from '../DocumentHeader/styled';
import {Theme} from "@material-ui/core";
import Color from 'color';
import trimWords from 'helpers/trimWords';


interface Props {
  onClick?: () => void;
  seasonNumber: number;
  secondaryText?: string;
  showId: string;
}

const StyledSeason = styled('div')`
  border: 1px solid ${props => Color((props.theme as Theme).palette.text.primary).alpha(0.3).string()};
  padding: 2rem 1rem;
  margin-bottom: 0.5rem;
  display: flex;
  transition: .3s all ease;
  
  .img-container {
    flex: 0 0 80px;
    margin-right: 2rem;
    img {
      
    }
  }
  .content {
    
  }
  
  &:hover {
    cursor: pointer;
    background-color: ${props => Color((props.theme as Theme).palette.text.primary).alpha(0.1).string()};
  }
`;

const Season: React.FC<Props> = props => {
  const { seasonNumber, onClick, showId } = props;
  const { data: season, error: tmdbError } = useSWR(
    () => `/tv/${showId}/season/${seasonNumber}`,
    tmdbFetcher,
    { revalidateOnFocus: false }
  );
  const { poster_path, overview } = season || {};

  return (
    <StyledSeason onClick={onClick}>
      <div className="img-container">
        {poster_path && (
          <img src={`${tmdb.image.w300}${poster_path}`} alt="season poster" />
        )}
      </div>

      <div className="content">
      <Typography variant="h4">Season {seasonNumber}</Typography>
      {overview && <Typography>{trimWords(overview, 200)}</Typography>}
      </div>
    </StyledSeason>
  );
};

export default Season;
