import React, { useEffect } from 'react';
import { useStores } from '../../stores/store';
import Material from './Material';
import Layout from 'components/Layout/Layout';
import { DateTime } from 'luxon';
import RemoveRedEye from '@material-ui/icons/RemoveRedEye';
import api from 'api/backend';
import { API } from '../../routes';

const History: React.FC = () => {
  const { historyStore } = useStores();

  const { fetchHistory, data } = historyStore;

  useEffect(() => {
    if (!data) fetchHistory();
  }, [data]);

  return (
    <Layout>
      {data && (
        <Material
          title="Movies History"
          columns={[
            {
              title: 'Movie',
              field: 'movie.title'
            },
            {
              title: 'Watched at',
              field: 'watched_at',
              render: rowData =>
                DateTime.fromISO(rowData.watched_at).toFormat('dd.M.yyyy')
            }
          ]}
          actions={[
            {
              icon: () => <RemoveRedEye />,
              tooltip: 'Detail',
              onClick: (event, rowData) => {}
            }
          ]}
          options={{
            actionsColumnIndex: -1
          }}
          data={query =>
            new Promise(async (resolve, reject) => {
              const url = API.history.index;
              const { page, pageSize, search } = query;
              const response = await api(url, {
                params: {
                  search,
                  page,
                  pageSize
                }
              });
              resolve({
                data: response.data,
                page: page,
                totalCount: 100
              });
            })
          }
        />
      )}
    </Layout>
  );
};

export default History;
