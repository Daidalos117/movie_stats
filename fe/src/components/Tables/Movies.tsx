import React, { useEffect, useRef } from 'react';
import { useStores } from 'stores/store';
import Material from './Material';
import { observer } from 'mobx-react';
import RemoveRedEye from '@material-ui/icons/RemoveRedEye';
import api from 'api/backend';
import { API, FE } from 'routes';
import { History as HistoryType } from 'stores/MoviesStore';
import { useHistory } from 'react-router';
import { fromISO } from 'helpers/formatDate';

const Movies: React.FC = () => {
  const { moviesStore, uiStore } = useStores();
  const history = useHistory();
  const tableRef = useRef(null);
  uiStore.menuBack = null;
  const { query: storeQuery } = moviesStore;

  useEffect(() => {
    moviesStore.tableRef = tableRef;
  }, []);

  return (
    <div>
      <Material
        title="Movies History"
        tableRef={moviesStore.tableRef}
        columns={[
          {
            title: 'Movie',
            field: 'movie.title'
          },
          {
            title: 'Watched at',
            field: 'watched_at',
            render: rowData => fromISO(rowData.watched_at).toFormat('dd.M.yyyy')
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
          new Promise(async resolve => {
            const url = API.movie.index;
            let response;

            if (storeQuery) {
              response = await api(url, {
                params: storeQuery
              });
              moviesStore.query = query;
            } else {
              response = await api(url, {
                params: query
              });
              moviesStore.query = query;
            }


            resolve({
              data: response.data.results,
              page: query.page,
              totalCount: response.data.count
            });
          })
        }
        onRowClick={(event, rowData) => {
          history.push(`${FE.movie.index}/${rowData.movie._id}`);
        }}
        onSearchChange={(searchText: string) => {
          console.log(searchText, 'search');
        }}
      />
    </div>
  );
};

export default observer(Movies);
