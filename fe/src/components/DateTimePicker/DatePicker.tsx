import React, { useState } from 'react';
/*
import DateFnsUtils from '@date-io/luxon';
import {
  DatePicker,
  DatePickerProps,
  MuiPickersUtilsProvider,

} from '@material-ui/pickers';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import ThemeProvider from '@material-ui/core/styles/MuiThemeProvider';

import { DateTime } from 'luxon';

interface OwnProps {
  id?: string;
  label?: string;
  name: string;
  format?: string;
  errorMessage?: string;
  onChangeSubmit?: boolean;
}

// type omitedDatePickerProps = Pick<DatePickerProps, Exclude<keyof DatePickerProps, 'value' | 'onChange'>>;

type Props = OwnProps & Partial<DatePickerProps>;

/!**
 * Basic wrapper around DateTimePicker
 * @param props
 * @constructor
 *!/
export const Picker: React.FC<Props> = props => {
  const {
    label,
    id,
    format,
    inputVariant,
    onChangeSubmit,
    disableToolbar,
    disabled,
    errorMessage,
    ...rest
  } = props;

  // managing with own state, so backspace work normally
  const [date, setDate] = useState<null | DateTime>(null);
  const variant = props.variant || 'inline';
  const isDialog = variant === 'dialog';
  const dateFormat = format || 'dd.MM.yyyy';
  const addedProps = isDialog
    ? {
        cancelLabel: 'Cancel',
        clearLabel: 'Clear',
        okLabel: 'OK',
        todayLabel: 'Today'
      }
    : {};

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={'cs'}>
      <DatePicker
        fullWidth
        variant={variant}
        inputVariant={inputVariant || 'outlined'}
        format={dateFormat}
        invalidLabel={'Invalid'}
        maxDateMessage={'Max'}
        minDateMessage={'Min'}
        disableToolbar={disableToolbar}
        placeholder={DateTime.local().toFormat(dateFormat)}
        id={id || name}
        label={label}
        disabled={disabled}
        {...addedProps}
        onChange={(date: MaterialUiPickersDate) => {
          setDate(date);
        }}
        onClose={() => {}}
        helperText={errorMessage}
        error={!!errorMessage}
        {...rest}
      />
    </MuiPickersUtilsProvider>
  );
};

*/


export default {};
