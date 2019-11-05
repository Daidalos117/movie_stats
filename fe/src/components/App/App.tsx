import React, { useEffect } from 'react';
import Menu from 'components/Menu/Menu';
import { useHistory } from 'react-router-dom';
import { useStores } from '../../stores/store';
import { FE } from '../../routes';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import {observer} from "mobx-react";
import HistoryTable from 'components/Tables/History';

const App: React.FC = () => {
  const { userStore, historyStore } = useStores();
  const history = useHistory();
  const { fetchHistory, data: histories } = historyStore;

  useEffect(() => {
    if (!userStore.user) {
      history.push(FE.index);
      return;
    }
    fetchHistory();
  }, [userStore]);

  return (
    <>
      <Menu />
      <Box mt={8} textAlign="center">
        {histories ? (
          <HistoryTable />
        ) : (
          <Button
            color="primary"
            variant="outlined"
            onClick={() => {
              historyStore.fetchHistory();
            }}
          >
            Sync now
          </Button>
        )}
      </Box>
    </>
  );
};

export default observer(App);
