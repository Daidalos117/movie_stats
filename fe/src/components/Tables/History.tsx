import React, { useEffect, useRef } from 'react';
import { useStores } from 'stores/store';
import Material from './Material';
import { observer } from 'mobx-react';
import Layout from 'components/Layout/Layout';
import { DateTime } from 'luxon';
import RemoveRedEye from '@material-ui/icons/RemoveRedEye';
import api from 'api/backend';
import { API, FE } from 'routes';
import { History as HistoryType } from 'stores/HistoryStore';
import { useHistory } from 'react-router';
import debounce from 'debounce';

const History: React.FC = () => {
  const { historyStore } = useStores();
  const history = useHistory();
  const { fetchHistory, data } = historyStore;
  const tableRef = useRef(null);

  useEffect(() => {
    historyStore.tableRef = tableRef;
  }, []);

  return (
    <div>
      <Material
        title="Movies History"
        tableRef={historyStore.tableRef}

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
              history.push(`${FE.movie.index}/${rowData.movie._id}`);
            }
          }
        ]}
        options={{
          actionsColumnIndex: -1,
          pageSize: 20,
          pageSizeOptions: [20, 50, 200]
        }}
        data={query =>
          new Promise(async (resolve, reject) => {
            const url = API.history.index;

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
    </div>
  );
};

export default observer(History);
