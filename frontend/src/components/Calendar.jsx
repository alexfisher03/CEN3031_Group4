import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import axios from 'axios';

function Calendar({ isGuest, onMeetingAdded }) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [meetings, setMeetings] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [hoverMeeting, setHoverMeeting] = useState(null);

  const navigate = useNavigate(); // React Router hook for navigation

  // Fetch meetings
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

  // Handle delete meeting
  const handleDeleteMeeting = async (meetingId) => {
    if (isGuest) {
      alert('Guests cannot delete meetings.');
      return;
    }

    const confirmDelete = window.confirm('Would you like to delete this meeting?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`/api/meetings/${meetingId}/`);
      alert('Meeting deleted successfully!');
      await fetchMeetings();
      setSelectedMeeting(null);
      if (onMeetingAdded) onMeetingAdded(); // Trigger update for Upcoming Meetings
    } catch (error) {
      console.error('Error deleting meeting:', error);
    }
  };

  // Handle new meeting submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isGuest) {
      alert('Guests cannot add meetings.');
      return;
    }

    if (!title || !date || !startTime || !endTime) {
      alert('Please fill out all fields.');
      return;
    }

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
      if (onMeetingAdded) onMeetingAdded(); // Trigger update for Upcoming Meetings
    } catch (error) {
      console.error('Error submitting meeting:', error);
    }
  };

  const handleEventClick = (clickInfo) => {
    const event = clickInfo.event;
    setSelectedMeeting({
      id: event.id,
      title: event.title,
      date: event.start.toLocaleDateString(),
      startTime: event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      endTime: event.end ? event.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'
    });
  };

  const handleEventMouseEnter = (mouseEnterInfo) => {
    const { event } = mouseEnterInfo;
    setHoverMeeting({
      title: event.title,
      date: event.start.toLocaleDateString(),
      startTime: event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      endTime: event.end ? event.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A',
      anchorElement: mouseEnterInfo.el
    });
  };

  const handleEventMouseLeave = () => {
    setHoverMeeting(null);
  };

  return (
    <div className="p-8 bg-gray-800 rounded-lg shadow-lg max-w-3xl mx-auto my-8 text-white">
      <h2 className="text-3xl font-bold text-center mb-6">UF Student Org Event Schedule</h2>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin]}
        initialView="dayGridMonth"
        events={meetings}
        height="auto"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        eventClick={handleEventClick}
        eventMouseEnter={handleEventMouseEnter}
        eventMouseLeave={handleEventMouseLeave}
        slotMinTime="08:00:00" // Start time at 8:00 AM
        slotMaxTime="20:00:00" // End time at 8:00 PM
        views={{
          timeGridWeek: {
            slotMinTime: "08:00:00",
            slotMaxTime: "20:00:00",
          },
          timeGridDay: {
            slotMinTime: "08:00:00",
            slotMaxTime: "20:00:00",
          },
        }}
      />

      {selectedMeeting && (
        <div className="mt-4 p-4 bg-gray-700 rounded text-center">
          <p><strong>{selectedMeeting.title}</strong></p>
          <p>{selectedMeeting.date}</p>
          <p>{selectedMeeting.startTime} - {selectedMeeting.endTime}</p>
          <button
            onClick={() => handleDeleteMeeting(selectedMeeting.id)}
            className="py-1 px-3 bg-indigo-600 rounded hover:bg-indigo-700 transition"
          >
            Delete Meeting
          </button>
        </div>
      )}

      {hoverMeeting && (
        <div
          style={{
            position: 'absolute',
            backgroundColor: 'rgba(0, 0, 0, 1)',
            color: 'white',
            padding: '8px',
            borderRadius: '4px',
            pointerEvents: 'none',
            zIndex: 1000,
            width: '200px',
            top: hoverMeeting.anchorElement.getBoundingClientRect().top + window.scrollY,
            left: hoverMeeting.anchorElement.getBoundingClientRect().right + 5 + window.scrollX
          }}
        >
          <p><strong>{hoverMeeting.title}</strong></p>
          <p>{hoverMeeting.date}</p>
          <p>{hoverMeeting.startTime} - {hoverMeeting.endTime}</p>
        </div>
      )}

      {!isGuest && (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="flex justify-center">
            <input
              type="text"
              placeholder="Meeting/Event Name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-1/2 px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:ring focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div className="flex justify-center">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-1/2 px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:ring focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div className="flex justify-center">
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-1/2 px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:ring focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div className="flex justify-center">
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-1/2 px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:ring focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-1/4 py-2 bg-indigo-600 rounded hover:bg-indigo-700 transition"
            >
              Submit Meeting
            </button>
          </div>
        </form>
      )}

      {isGuest && (
        <>
          <p className="text-center text-gray-400 mt-4">
            Guests cannot add or delete meetings. Please log in to add or delete meetings.
          </p>
          <div className="flex justify-center mt-3">
            <button
              onClick={() => navigate('/')}
              className="w-1/4 py-2 bg-indigo-600 rounded hover:bg-indigo-700 transition"
            >
              Log In
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Calendar;
