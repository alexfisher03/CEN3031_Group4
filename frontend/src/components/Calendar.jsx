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
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [selectedMeetingDate, setSelectedMeetingDate] = useState(null);
  const [selectedMeetingStartTime, setSelectedMeetingStartTime] = useState(null);
  const [selectedMeetingEndTime, setSelectedMeetingEndTime] = useState(null);
  const [hoverMeeting, setHoverMeeting] = useState(null);

  const fetchMeetings = async () => {
    try {
      const response = await axios.get('/api/meetings/');
      const fetchedMeetings = response.data.map((meeting) => ({
        title: meeting.title,
        start: `${meeting.date}T${meeting.start_time}`,
        end: `${meeting.date}T${meeting.end_time}`,
      }));
      setMeetings(fetchedMeetings);
    }
    catch (error) {
      console.error('Error fetching meetings:', error);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const getEventColor = (start, end) => {
    const startTime = new Date(start);
    const endTime = new Date(end);
    const duration = (endTime - startTime) / (1000 * 60); // duration in minutes

    if (duration <= 60) {
      return '#20B2AA';
    }
    if (duration <= 120) {
      return '#7B68EE';
    }
    return '#C71585';
  };

  const renderEventContent = (eventInfo) => {
    const color = getEventColor(eventInfo.event.start, eventInfo.event.end);
    return (
      <div
        className="flex items-center"
        style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        <span
          className="w-2 h-2 rounded-full mr-2"
          style={{ backgroundColor: color }}
        ></span>
        <span
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: 'calc(100% - 12px)',
            display: 'inline-block',
          }}
        >
          {eventInfo.event.title}
        </span>
      </div>
    );
  };

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

    // Check for time conflicts
    const conflict = meetings.some((meeting) => {
      const meetingStart = meeting.start.split('T')[1];
      const meetingEnd = meeting.end.split('T')[1];
    
      return (
        meeting.start.includes(date) &&
        !(endTime === meetingStart || startTime === meetingEnd) &&
        (
          (startTime >= meetingStart && startTime < meetingEnd) ||
          (endTime > meetingStart && endTime <= meetingEnd) ||
          (startTime <= meetingStart && endTime >= meetingEnd)
        )
      );
    });
    
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

  const handleEventClick = (clickInfo) => {
    if (selectedMeeting) {
      setSelectedMeeting(null);
      setSelectedMeetingDate(null);
      setSelectedMeetingStartTime(null);
      setSelectedMeetingEndTime(null);
    } else {
      setSelectedMeeting(clickInfo.event.title);
      setSelectedMeetingDate(clickInfo.event.start.toLocaleDateString());
      setSelectedMeetingStartTime(
        clickInfo.event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      );
      setSelectedMeetingEndTime(
        clickInfo.event.end
          ? clickInfo.event.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : 'N/A'
      );
    }
  };

  const handleEventMouseEnter = (mouseEnterInfo) => {
    const { event } = mouseEnterInfo;
    setHoverMeeting({
      title: event.title,
      date: event.start.toLocaleDateString(),
      startTime: event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      endTime: event.end
        ? event.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : 'N/A',
      anchorElement: mouseEnterInfo.el,
    });
  };

  const handleEventMouseLeave = () => {
    setHoverMeeting(null);
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
          right: 'dayGridMonth,timeGridDay',
        }}
        eventClick={handleEventClick}
        eventMouseEnter={handleEventMouseEnter}
        eventMouseLeave={handleEventMouseLeave}
        eventContent={renderEventContent} // Custom rendering
      />

      {selectedMeeting && (
        <div className="mt-4 p-4 bg-gray-700 rounded text-center">
          <p><strong>{selectedMeeting}</strong></p>
          <p>{selectedMeetingDate}</p>
          <p>{selectedMeetingStartTime} - {selectedMeetingEndTime}</p>
        </div>
      )}

      {hoverMeeting && (
        <div
          style={{
            position: 'absolute',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            color: 'white',
            padding: '8px',
            borderRadius: '4px',
            pointerEvents: 'none',
            zIndex: 1000,
            width: '200px',
            top: hoverMeeting.anchorElement.getBoundingClientRect().top + window.scrollY,
            left: hoverMeeting.anchorElement.getBoundingClientRect().right + 5 + window.scrollX,
          }}
        >
          <p><strong>{hoverMeeting.title}</strong></p>
          <p>{hoverMeeting.date}</p>
          <p>{hoverMeeting.startTime} - {hoverMeeting.endTime}</p>
        </div>
      )}

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
          Guests cannot add meetings. Please log in to add meetings.
        </p>
      )}
    </div>
  );
}

export default Calendar;
