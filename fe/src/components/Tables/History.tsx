import React, { useEffect } from 'react';
import { useStores } from '../../stores/store';
import Material from './Material';
import Grid from '@material-ui/core/Grid';

const History: React.FC = () => {
  const { historyStore } = useStores();

  const { fetchHistory, data } = historyStore;

  useEffect(() => {
    if (!data) fetchHistory();
  }, [data]);

  console.log(data);
  return (
    <>
      <Grid container justify="center">
        <Grid item xs={12} lg={8} md={10}>
          {data && (
            <Material
              columns={[{ title: 'watched_at', field: 'watched_at' }]}
              data={data}
            />
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default History;
