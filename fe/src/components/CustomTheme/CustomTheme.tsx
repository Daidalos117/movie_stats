import React from 'react';
import createMuiTheme, {
  ThemeOptions,
  Theme
} from '@material-ui/core/styles/createMuiTheme';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { useStores } from '../../stores/store';
import { observer } from 'mobx-react';
import { red } from '@material-ui/core/colors';

const generalTheme = {
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: red["700"]
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    }
  }
};

// key theme customizations
const lightTheme: ThemeOptions = {
  ...generalTheme
};

const darkTheme: ThemeOptions = {
  ...generalTheme,
  palette: {
    type: 'dark',
    ...generalTheme.palette
  }
};

export const themes = {
  light: lightTheme,
  dark: darkTheme
};

const CustomTheme: React.FC = ({ children }) => {
  const { uiStore } = useStores();
  const { theme: actualTheme } = uiStore;

  const theme: Theme = createMuiTheme(actualTheme ? lightTheme : darkTheme);

  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
};

export default observer(CustomTheme);
