import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import axios from 'axios';

function Calendar() {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [meetings, setMeetings] = useState([]);

  // Fetch meetings from the backend when the component mounts
  useEffect(() => {
    axios
      .get('http://localhost:8000/api/meetings/')
      .then((response) => {
        const fetchedMeetings = response.data.map((meeting) => ({
          title: meeting.title,
          start: `${meeting.date}T${meeting.time}`,
        }));
        setMeetings(fetchedMeetings);
      })
      .catch((error) => {
        console.error('Error fetching meetings:', error);
      });
  }, []);

  const handleSubmit = async () => {
    try {
      // Check for meeting conflicts before submitting
      const conflict = meetings.find((meeting) => meeting.start.includes(date));

      if (conflict) {
        alert('A meeting is already scheduled for this date!');
        return; // Stop submission if conflict exists
      }

      // If no conflict, submit the new meeting
      await axios.post('http://localhost:8000/api/meetings/', {
        title,
        date,
        time,
      });

      alert('Meeting submitted successfully!');
      setTitle('');
      setDate('');
      setTime('');

      // Re-fetch meetings after submission
      const response = await axios.get('http://localhost:8000/api/meetings/');
      const updatedMeetings = response.data.map((meeting) => ({
        title: meeting.title,
        start: `${meeting.date}T${meeting.time}`,
      }));
      setMeetings(updatedMeetings);
    } catch (error) {
      console.error('Error submitting meeting:', error);
    }
  };

  return (
    <div>
      <h2>Meeting Calendar</h2>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={meetings} // Pass the meetings as events
      />
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
