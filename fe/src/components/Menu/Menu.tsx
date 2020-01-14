import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import { useStores } from '../../stores/store';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import ThemeSwitch from 'components/ThemeSwitch/ThemeSwitch';
import { traktLogin } from '../../routes';
import styled from 'styled-components';
import Layout from 'components/Layout/Layout';
import { FE } from '../../routes';

interface Props {}

const StyledToolbar = styled(Toolbar)`
  justify-content: space-between;
`;

const StyledLink = styled(Link)`
  color: white;
  text-decoration: none;
`;

const StyledButton = styled(Button)`
  color: white;
 
`;

const Menu: React.FC<Props> = () => {
  const { userStore } = useStores();
  const { user } = userStore;

  return (
    <AppBar position="static">
      <StyledToolbar>
        <Layout withoutPadding>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex"  alignItems="center">
              <StyledLink to={`/${FE.movie.index}`}>
                <StyledButton>Movies</StyledButton>
              </StyledLink>
              <StyledLink to={`/${FE.show.index}`}>
                <StyledButton>Shows</StyledButton>
              </StyledLink>
            </Box>

            <Box display="flex" alignItems="center">
              <Box mr={2}>
                <ThemeSwitch />
              </Box>
              {!user ? (
                <Button href={traktLogin} color="inherit">
                  Login
                </Button>
              ) : (
                <Typography>{user.username}</Typography>
              )}
            </Box>
          </Box>
        </Layout>
      </StyledToolbar>
    </AppBar>
  );
};

export default observer(Menu);
