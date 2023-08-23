import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';


export default function Calendario({ children }) {
    const localizer = momentLocalizer(moment);
    const [selectedDates, setSelectedDates] = useState([]);

    const handleSelect = ({ start, end }) => {
      const selectedRange = [];
      let currentDate = start;
  
      while (currentDate <= end) {
        selectedRange.push(currentDate);
        currentDate = moment(currentDate).add(1, 'days').toDate();
      }
  
      setSelectedDates(selectedRange);
    };
  return (
    <div style={{ height: 500 }}>
    <Calendar
      localizer={localizer}
      selectable
      events={[]}
      onSelectSlot={handleSelect}
      selected={selectedDates}
    />
    <div>
      <h3>Dias Selecionados:</h3>
      {selectedDates.map((date, index) => (
        <p key={index}>{moment(date).format('YYYY-MM-DD')}</p>
      ))}
    </div>
  </div>
  );
}