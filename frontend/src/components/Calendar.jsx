import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';

import dayGridPlugin from '@fullcalendar/daygrid';

import axios from 'axios';



function Calendar() {
  const [title, setTitle] = useState('');

  const [date, setDate] = useState('');

  const [time, setTime] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/meetings/', {
        title,
        date,
        time,
      });
      alert('Meeting submitted successfully!');
      // Optionally clear the form after submission
      setTitle('');

      setDate('');

      setTime('');
    } catch (error) {

      console.error('Error submitting meeting:', error);

    }

  };

  return (
    <div>
      <h2>Meeting Calendar</h2>
      <FullCalendar plugins={[dayGridPlugin]} initialView="dayGridMonth" />
      <div>
        <input
          type="text"
          placeholder="Meeting Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
        <button onClick={handleSubmit}>Submit Meeting</button>
      </div>
    </div>

  );

}



export default Calendar;


