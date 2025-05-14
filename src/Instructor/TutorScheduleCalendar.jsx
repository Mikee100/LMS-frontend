import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useState, useEffect } from 'react';
import { parseISO } from 'date-fns';
import moment from 'moment';

const localizer = momentLocalizer(moment);

function TutorScheduleCalendar() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/schedule', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => {
        const formattedEvents = data.map(item => ({
          id: item._id,
          title: item.title,
          start: new Date(item.start),
          end: new Date(item.end),
        }));
        setEvents(formattedEvents);
      });
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Class Schedule</h2>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
      />
    </div>
  );
}
