import React from 'react';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';
import { traktLogin } from '../../routes';
import { useStores } from '../../stores/store';
import { observer } from 'mobx-react';
import CircularProgress from '@material-ui/core/CircularProgress';

const Wrapper = styled('div')`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url(${process.env.PUBLIC_URL}/img/login_bg.jpg);
  background-size: contain;
`;

interface Props {}

const LoginPage: React.FC<Props> = props => {
  const { userStore } = useStores();
  const { logging } = userStore;

  return (
    <Wrapper>
      <Button
        href={traktLogin}
        variant="outlined"
        size="large"
        color="secondary"
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
          "Login"
        )}
      </Button>
    </Wrapper>
  );
};

export default observer(LoginPage);
