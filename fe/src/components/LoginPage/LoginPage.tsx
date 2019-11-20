import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';
import { traktLogin } from '../../routes';
import { useStores } from '../../stores/store';
import { observer } from 'mobx-react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useHistory } from 'react-router';
import { localStorageRedirectKey } from 'App';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

const Wrapper = styled('div')`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url(${process.env.PUBLIC_URL}/img/login_bg.jpg);
  background-size: cover;
  background-repeat: no-repeat;
`;

const StyledCard = styled(Card)`
  padding: 1rem 2rem;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  .MuiPaper-root {
  }
`;

interface Props {}

const LoginPage: React.FC<Props> = props => {
  const { userStore } = useStores();
  const { logging, user } = userStore;
  const history = useHistory();

  useEffect(() => {
    if (user) {
      const redirectAfter = localStorage.getItem(localStorageRedirectKey);
      history.push(redirectAfter || '/');
      if (redirectAfter) {
        localStorage.removeItem(localStorageRedirectKey);
      }
    }
  }, [user]);

  return (
    <Wrapper>
      <StyledCard>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Trakt.tv
          </Typography>
          <Box mt={2}>
            <Button
              href={traktLogin}
              variant="outlined"
              size="large"
              color="secondary"
              fullWidth
              onClick={() => {
                userStore.logging = true;
              }}
            >
              {logging ? (
                <>
                  <CircularProgress size={16} />
                  logging
                </>
              ) : (
                'Login'
              )}
            </Button>
          </Box>
        </CardContent>
      </StyledCard>
    </Wrapper>
  );
};

export default observer(LoginPage);
