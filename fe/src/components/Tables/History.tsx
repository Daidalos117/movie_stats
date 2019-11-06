import React, { useEffect } from 'react';
import { useStores } from 'stores/store';
import Material from './Material';
import Layout from 'components/Layout/Layout';
import { DateTime } from 'luxon';
import RemoveRedEye from '@material-ui/icons/RemoveRedEye';
import api from 'api/backend';
import { API, FE } from 'routes';
import { history } from 'helpers/history';
import {History as HistoryType} from 'stores/HistoryStore';

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
              onClick: (event, rowData: HistoryType) => {
                history.push(`${FE.movie.detail}${rowData.movie.title}`);
              }
            }
          ]}
          options={{
            actionsColumnIndex: -1
          }}
          data={query =>
            new Promise(async (resolve, reject) => {
              const url = API.history.index;

              console.log(query);
              const response = await api(url, {
                params: query
              });
              resolve({
                data: response.data.results,
                page: query.page,
                totalCount: response.data.count
              });
            })
          }
        />
      )}
    </Layout>
  );
};

export default History;
