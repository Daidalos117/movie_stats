import React from 'react';
import { createMuiTheme } from '@material-ui/core/styles';
import {Theme} from "@material-ui/core/styles";
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';


// key theme customizations
const customTheme = {

};

// theme generated from the theme customisations above
// so the overrides can acces theme values
export const theme = createMuiTheme({});

const CustomTheme: React.FC = ({ children }) => (
  <>{children}</>
);

export default CustomTheme;
