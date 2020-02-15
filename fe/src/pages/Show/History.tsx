import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useStores } from '../../stores/store';
import { FE } from '../../routes';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import { observer } from 'mobx-react';
import HistoryTable from 'components/Tables/Shows';
import LoadingDialog from 'components/LoadingDialog/LoadingDialog';

const History: React.FC = () => {
  const { userStore, showsStore } = useStores();
  const history = useHistory();
  const { syncWithApi, syncing, tableRef } = showsStore;

  useEffect(() => {
    if (!userStore.user) {
      history.push(FE.index);
      return;
    }
  }, [userStore, history]);

  return (
    <>
      <Box textAlign="right">
        <LoadingDialog open={syncing} />
        <Button
          color="primary"
          variant="outlined"
          onClick={async () => {
            const response = await syncWithApi();

            if (response?.data && tableRef?.current) {
              tableRef.current.onQueryChange();
            }
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
