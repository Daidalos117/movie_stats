import React, { useState } from 'react';
import { forwardRef } from 'react';
import MaterialTable, {
  Icons,
  MaterialTableProps,
  MTableToolbar
} from 'material-table';
import AddBox from '@material-ui/icons/AddBox';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import DateFnsUtils from '@date-io/luxon';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import { DateTime } from 'luxon';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import IconButton from '@material-ui/core/IconButton/IconButton';
import Box from '@material-ui/core/Box';
import CalendarToday from '@material-ui/icons/CalendarToday';

const tableIcons: Icons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

const Material: React.FC<MaterialTableProps<any>> = ({
  options,
  components,
  ...restProps
}) => {
  const [date, setDate] = useState<string>(DateTime.local().toSQLDate());
  const [isOpen, setIsOpen] = useState(false);

  return (
    <MaterialTable
      options={{
        ...options,
        debounceInterval: 500
      }}
      icons={tableIcons}
      title=""
      components={{
        ...components,
        Toolbar: props => (
          <div>
            <Box display="flex" alignItems="center">
              <div style={{ width: '95%' }}>
                <MTableToolbar {...props} />
              </div>

              <IconButton
                edge="start"
                color="inherit"
                aria-label="back"
                onClick={() => setIsOpen(true)}
                style={{}}
              >
                <CalendarToday />
              </IconButton>
            </Box>

            <Box display="none">
              <MuiPickersUtilsProvider utils={DateFnsUtils} locale={'cs'}>
                <DatePicker
                  value={date}
                  format="yyyy-MM-dd"
                  onChange={(dateValue: MaterialUiPickersDate) => {
                    if (dateValue) {
                      const sqlDate = dateValue.toSQLDate();
                      setDate(sqlDate);
                      props.onSearchChanged(sqlDate);
                    }
                  }}
                  open={isOpen}
                  onOpen={() => setIsOpen(true)}
                  onClose={() => setIsOpen(false)}
                />
              </MuiPickersUtilsProvider>
            </Box>
          </div>
        )
      }}
      {...restProps}
    />
  );
};

export default Material;
