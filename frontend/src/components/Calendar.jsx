import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid'; 
import axios from 'axios';

function Calendar({ isGuest }) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [meetings, setMeetings] = useState([]);

  const fetchMeetings = async () => {
    try {
      const response = await axios.get('/api/meetings/');
      const fetchedMeetings = response.data.map((meeting) => ({
        id: meeting.id, 
        title: meeting.title,
        start: `${meeting.date}T${meeting.start_time}`,
        end: `${meeting.date}T${meeting.end_time}`
      }));
      setMeetings(fetchedMeetings);
    } catch (error) {
      console.error('Error fetching meetings:', error);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const handleDeleteMeeting = async (event) => { 
    if (isGuest) {
      alert("Guests cannot delete meetings.");
      return;
    }

    const confirmDelete = window.confirm(`Would you like to delete the meeting "${event.event.title}"?`);
    if (!confirmDelete) return;

    try {
      await axios.delete(`/api/meetings/${event.event.id}/`);
      alert('Meeting deleted successfully!');
      await fetchMeetings();
    } catch (error) {
      console.error('Error deleting meeting:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isGuest) {
      alert("Guests cannot add meetings.");
      return;
    }

    if (!title || !date || !startTime || !endTime) {
      alert("Please fill out all fields.");
      return;
    }

    // Check for time conflicts
    const conflict = meetings.some((meeting) => 
      meeting.start.includes(date) &&
      (
        (startTime >= meeting.start.split('T')[1] && startTime < meeting.end.split('T')[1]) ||
        (endTime > meeting.start.split('T')[1] && endTime <= meeting.end.split('T')[1]) ||
        (startTime <= meeting.start.split('T')[1] && endTime >= meeting.end.split('T')[1])
      )
    );

    if (conflict) {
      alert('A meeting is already scheduled during this time block!');
      return;
    }

    try {
      await axios.post('/api/meetings/', { title, date, start_time: startTime, end_time: endTime });
      alert('Meeting submitted successfully!');
      setTitle('');
      setDate('');
      setStartTime('');
      setEndTime('');
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
          right: 'dayGridMonth,timeGridWeek, timeGridDay'
        }}
        eventClick={handleDeleteMeeting}
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
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:ring focus:ring-indigo-500 focus:outline-none"
          />
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
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
          Guests cannot add or delete meetings. Please log in to add or delete meetings.
        </p>
      )}
    </div>
  );
}

export default Calendar;
