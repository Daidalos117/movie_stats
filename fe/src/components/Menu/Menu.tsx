import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { useStores } from '../../stores/store';
import { observer } from 'mobx-react';

import { traktLogin } from '../../routes';
import styled from 'styled-components';

interface Props {}

const StyledToolbar = styled(Toolbar)`
  justify-content: space-between;
`;

const Menu: React.FC<Props> = () => {
  const { userStore } = useStores();
  const { user } = userStore;

  return (
    <AppBar position="static">
      <StyledToolbar>
        <IconButton edge="start" color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton>

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
