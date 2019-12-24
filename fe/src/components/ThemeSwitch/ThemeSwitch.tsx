import React from 'react';
import LightIcon from '@material-ui/icons/Brightness7';
import DarkIcon from '@material-ui/icons/Brightness4';
import { useStores } from '../../stores/store';
import IconButton from '@material-ui/core/IconButton/IconButton';
import {observer} from "mobx-react";

interface Props {}

const ThemeSwitch: React.FC<Props> = props => {
  const { uiStore } = useStores();
  const { theme } = uiStore;

  return (
    <IconButton
      edge="start"
      color="inherit"
      aria-label="back"
      onClick={() => {
        uiStore.theme = !theme;
      }}
    >
      {theme ? <DarkIcon /> : <LightIcon />}
    </IconButton>
  );
};

export default observer(ThemeSwitch);
