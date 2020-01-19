import React, { useEffect, useRef, useState } from 'react';
import { useStores } from 'stores/store';
import Material from './Material';
import { observer } from 'mobx-react';
import RemoveRedEye from '@material-ui/icons/RemoveRedEye';
import api from 'api/backend';
import { API, FE } from 'routes';
import { History as HistoryType } from 'stores/ShowsStore';
import { useHistory } from 'react-router';
import { fromISO } from 'helpers/formatDate';

const Shows: React.FC = () => {
  const { showsStore, uiStore } = useStores();
  const [firstLoad, setFirstLoad] = useState(true);
  const history = useHistory();
  const tableRef = useRef(null);
  uiStore.menuBack = null;
  const { query: storeQuery } = showsStore;

  useEffect(() => {
    showsStore.tableRef = tableRef;
  }, [showsStore]);

  return (
    <div>
      <Material
        title="Shows History"
        tableRef={showsStore.tableRef}
        columns={[
          {
            title: 'show',
            field: 'show.title'
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
              history.push(`${FE.show.index}/${rowData.show._id}`);
            }
          }
        ]}
        options={{
          actionsColumnIndex: -1,
          pageSize: 20,
          pageSizeOptions: [20, 50, 200],
          searchText: (storeQuery && storeQuery.search) || '',
        }}
        data={query =>
          new Promise(async resolve => {
            const url = API.show.index;
            let realQuery = query;

            if (storeQuery && firstLoad) {
              realQuery = storeQuery;
              setFirstLoad(false);
            } else {
              if (query) showsStore.query = query;
            }

            const response = await api(url, {
              params: realQuery
            });

            setFirstLoad(false);

            resolve({
              data: response.data.results,
              page: realQuery.page,
              totalCount: response.data.count
            });
          })
        }
        onRowClick={(event, rowData) => {
          history.push(`${FE.show.index}/${rowData.show._id}`);
        }}

      />
    </div>
  );
};

export default observer(Shows);
