import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DateFilter = ({ onDateChange }: { onDateChange: (dates: [Date | null, Date | null]) => void }) => {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [startDate, endDate] = dateRange;

  return (
    <div className="flex items-center space-x-4">
      <DatePicker
        selectsRange
        startDate={startDate}
        endDate={endDate}
        onChange={(update) => {
          setDateRange(update);
          onDateChange(update);
        }}
        isClearable
        placeholderText="Select date range"
        className="border border-gray-300 p-2 rounded"
      />
    </div>
  );
};

export default DateFilter;
