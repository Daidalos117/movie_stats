import React from 'react';
import Grid from '@material-ui/core/Grid/Grid';
import styled from 'styled-components';

interface Props {
  withoutPadding?: boolean;
}

const StyledGrid = styled(Grid)<Props>`
  padding: ${props => props.withoutPadding ? '0' : '3rem 2rem'};
  position: relative;
`;

const Layout: React.FC<Props> = ({ children, withoutPadding }) => (
  <>
    <Grid container justify="center" style={{height: '100%'}}>
      <StyledGrid item xs={12} lg={10} md={10} withoutPadding={withoutPadding}>
        {children}
      </StyledGrid>
    </Grid>
  </>
);

export default Layout;
