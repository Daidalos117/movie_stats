import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useStores } from '../../stores/store';
import { FE } from '../../routes';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import { observer } from 'mobx-react';
import HistoryTable from 'components/Tables/Movies';

const History: React.FC = () => {
  const { userStore, historyStore } = useStores();
  const history = useHistory();
  const {  syncData, tableRef } = historyStore;

  useEffect(() => {
    if (!userStore.user) {
      history.push(FE.index);
      return;
    }
  }, [userStore]);

  return (
    <>
      <Box textAlign="right">
        <Button
          color="primary"
          variant="outlined"
          onClick={() => {
            syncData().then(response => {

              if (
                response &&
                typeof response === 'object' &&
                'data' in response &&
                tableRef &&
                tableRef.current
              ) {
                tableRef.current.onQueryChange();
              }
            });
          }}
        >
          Sync now
        </Button>
        <HistoryTable />
      </Box>
    </>
  );
};

export default observer(History);
