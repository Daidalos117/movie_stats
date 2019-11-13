import React, { Suspense } from 'react';
import Grid from '@material-ui/core/Grid/Grid';
import Menu from '../Menu/Menu';
import Loading from '../Loading/Loading';
import styled from 'styled-components';
import Toolbar from "@material-ui/core/Toolbar/Toolbar";
interface Props {}

const StyledGrid = styled(Grid)` 
  padding: 3rem 2rem;
`;

const Layout: React.FC<Props> = ({ children }) => (
  <>
    <Grid container justify="center">
      <StyledGrid item xs={12} lg={8} md={10}>
        {children}
      </StyledGrid>
    </Grid>
  </>
);

export default Layout;
