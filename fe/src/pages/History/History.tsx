import React, { useEffect, useState, RefObject } from 'react';
import Menu from 'components/Menu/Menu';
import { useHistory } from 'react-router-dom';
import { useStores } from '../../stores/store';
import { FE } from '../../routes';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import { observer } from 'mobx-react';
import HistoryTable from 'components/Tables/History';
import { History as HistoryObj } from '../../stores/HistoryStore';
import Layout from "../../components/Layout/Layout";

const History: React.FC = (props) => {
  const { userStore, historyStore } = useStores();
  const [sync, setSync] = useState<null | HistoryObj[]>();
  const history = useHistory();
  const { fetchHistory, data: histories, syncData, tableRef } = historyStore;

  console.log(props);
  useEffect(() => {
    if (!userStore.user) {
      history.push(FE.index);
      return;
    }
    //fetchHistory();
  }, [userStore]);

  return (
    <Layout>
      <Box mt={8} textAlign="right">
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
    </Layout>
  );
};

export default observer(History);
