import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ArrowBack from '@material-ui/icons/ArrowBack';
import { useStores } from '../../stores/store';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';

import { traktLogin } from '../../routes';
import styled from 'styled-components';

interface Props {}

const StyledToolbar = styled(Toolbar)`
  justify-content: space-between;
`;

const StyledLink = styled(Link)`
  color: white;
`;

const Menu: React.FC<Props> = () => {
  const { userStore, uiStore } = useStores();
  const { user } = userStore;
  const { menuBack } = uiStore;

  return (
    <AppBar position="static">
      <StyledToolbar>
        <div>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          {menuBack && (
            <StyledLink to={menuBack}>
              <IconButton edge="start" color="inherit" aria-label="back">
                <ArrowBack />
              </IconButton>
            </StyledLink>
          )}
        </div>

        {!user ? (
          <Button href={traktLogin} color="inherit">
            Login
          </Button>
        ) : (
          <Typography>{user.username}</Typography>
        )}
      </StyledToolbar>
    </AppBar>
  );
};

export default observer(Menu);
