import React from 'react';
import Grid from '@material-ui/core/Grid/Grid';
import styled from 'styled-components';

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
