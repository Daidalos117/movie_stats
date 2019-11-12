import React from 'react';
import Grid from '@material-ui/core/Grid/Grid';
import Menu from "../Menu/Menu";

interface Props {}

const Layout: React.FC<Props> = ({ children }) => (
  <>
    <Menu />
    <Grid container justify="center">
      <Grid item xs={12} lg={8} md={10}>
        {children}
      </Grid>
    </Grid>
  </>
);

export default Layout;
