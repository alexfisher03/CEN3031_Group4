import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';

import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';

import axios from 'axios';

function Calendar({ isGuest }) {
  const [title, setTitle] = useState('');

  const [date, setDate] = useState('');

  const [time, setTime] = useState('');
  const [meetings, setMeetings] = useState([]);

  const fetchMeetings = async () => {
    try {
      const response = await axios.get('/api/meetings/');
      const fetchedMeetings = response.data.map((meeting) => ({
        title: meeting.title,
        start: `${meeting.date}T${meeting.time}`,
      }));
      setMeetings(fetchedMeetings);
    } catch (error) {
      console.error('Error fetching meetings:', error);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isGuest) {
      alert("Guests cannot add meetings.");
      return;
    }

    if (!title || !date || !time) {
      alert("Please fill out all fields.");
      return;
    }

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
      await fetchMeetings();
    } catch (error) {

      console.error('Error submitting meeting:', error);

    }

  };

  return (
    <div className="p-8 bg-gray-800 rounded-lg shadow-lg max-w-3xl mx-auto my-8 text-white">
      <h2 className="text-3xl font-bold text-center mb-6">UF Student Org Event Schedule</h2>

      {/* Calendar display */}
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin]}
        initialView="dayGridMonth"
        events={meetings}
        height="auto"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridDay'
        }}
      />

      {/* Conditional form display */}
      {!isGuest && (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="text"
            placeholder="Meeting/Event Name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:ring focus:ring-indigo-500 focus:outline-none"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:ring focus:ring-indigo-500 focus:outline-none"
          />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:ring focus:ring-indigo-500 focus:outline-none"
          />
          <button
            type="submit"
            className="w-full py-2 bg-indigo-600 rounded hover:bg-indigo-700 transition"
          >
            Submit Meeting
          </button>
        </form>
      )}

      {/* Message for guest users */}
      {isGuest && (
        <p className="text-center text-gray-400 mt-4">
          Guests cannot add meetings. Please log in to add meetings.
        </p>
      )}
    </div>

  );

}



export default Calendar;


