import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function DatePickerValue({inDate, outDate, setInDate, setOutDate}) {
  const [value, setValue] = React.useState(dayjs('2022-04-17'));

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker', 'DatePicker']}>
        <DatePicker 
          label="Trip start date"
          value={inDate}
          onChange={(newValue) => setInDate(newValue)}
        />
        <DatePicker
          label="Trip end date"
          value={outDate}
          onChange={(newValue) => setOutDate(newValue)}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
