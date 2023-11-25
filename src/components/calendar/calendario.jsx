import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import "moment/locale/pt-br";

export default function Calendario({ catchHors }) {
  const [events, setEvents] = useState([]);
  const localizer = momentLocalizer(moment);
  var defaultMessages = {
    date: "Data",
    time: "Hora",
    event: "Evento",
    allDay: "Dia Todo",
    week: "Semana",
    work_week: "Eventos",
    day: "Dia",
    month: "Mês",
    previous: "Anterior",
    next: "Próximo",
    yesterday: "Ontem",
    tomorrow: "Amanhã",
    today: "Hoje",
    agenda: "Agenda",
    noEventsInRange: "Não há eventos no período.",
    showMore: function showMore(total) {
      return "+" + total + " mais";
    }
  };

  const handleSelectSlot = ({ start, end }) => {
    const newEvent = { title: 'Marked', start, end };
    if (new Date(start).getDay() != end.getDay()) {
      return
    }

    const verify = events.some((item) =>
      new Date(item.start).getTime() == new Date(start).getTime())

    if (!verify) {
      setEvents([...events, newEvent]);
    } else {
      const filter = events.filter((event) => new Date(start).getTime() != new Date(event.start).getTime())
      setEvents(filter);

    }

  };

  useEffect(() => {
    catchHors(events)

  }, [events])

  return (
    <div style={{ height: 500 }} className='bg-white'>
      <Calendar
        selectable={true}
        onSelectSlot={handleSelectSlot}
        localizer={localizer}
        events={events}
        startAccessor='start'
        endAccessor='end'
        messages={defaultMessages}
        view='week'
        style={{ height: 500 }}
      />
    </div>
  );
}
