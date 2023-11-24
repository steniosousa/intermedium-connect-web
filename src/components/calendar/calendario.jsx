import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

export default function Calendario() {
  const localizer = momentLocalizer(moment);

  const [events, setEvents] = useState([]);

  const handleSelectSlot = ({ start, end }) => {
    const newEvent = { title: 'Marked', start, end };


    setEvents([...events, newEvent]);

  };

  return (
    <div style={{ height: 500 }} className='bg-white'>
      <Calendar
        selectable={true}
        onSelectSlot={handleSelectSlot}
        localizer={localizer}
        events={events}
        startAccessor='start'
        endAccessor='end'
        style={{ height: 500 }}
      />
    </div>
  );
}
