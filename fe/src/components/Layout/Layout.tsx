import React from 'react';
import Grid from '@material-ui/core/Grid/Grid';

interface Props {}

const Layout: React.FC<Props> = ({ children }) => (
  <Grid container justify="center">
    <Grid item xs={12} lg={8} md={10}>
      {children}
    </Grid>
  </Grid>
);

export default Layout;
