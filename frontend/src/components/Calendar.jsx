import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import axios from 'axios';

function Calendar() {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [meetings, setMeetings] = useState([]);

  useEffect(() => {
    axios.get('/api/meetings/')
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
      const conflict = meetings.some((meeting) => meeting.start.includes(date));

      if (conflict) {
        alert('A meeting is already scheduled for this date!');
        return;
      }

      await axios.post('/api/meetings/', { title, date, time });
      alert('Meeting submitted successfully!');
      setTitle('');
      setDate('');
      setTime('');

      const response = await axios.get('/api/meetings/');
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
    <div className="p-8 bg-white rounded-lg shadow-lg max-w-3xl mx-auto my-8">
      <h2 className="text-3xl font-bold text-gray-700 mb-6 text-center">Meeting Calendar</h2>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={meetings}
        height="auto"
      />
      <div className="flex flex-col mt-6 space-y-4">
        <input
          type="text"
          placeholder="Meeting Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button
          onClick={handleSubmit}
          className="bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 transition duration-200"
        >
          Submit Meeting
        </button>
      </div>
    </div>
  );
}

export default Calendar;
