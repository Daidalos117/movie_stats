import React from 'react';
import createMuiTheme, {
  ThemeOptions,
  Theme
} from '@material-ui/core/styles/createMuiTheme';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import { useStores } from '../../stores/store';
import { observer } from 'mobx-react';
import { red } from '@material-ui/core/colors';
import { ThemeProvider } from 'styled-components';

const generalTheme = {
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: red['700']
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
  const themeObj = actualTheme ? lightTheme : darkTheme;

  const theme: Theme = createMuiTheme(themeObj);

  return (
    <MuiThemeProvider theme={theme}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </MuiThemeProvider>
  );
};

export default observer(CustomTheme);
