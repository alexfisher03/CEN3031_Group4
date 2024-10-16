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

  const styles = {
    container: {
      padding: '20px',
      textAlign: 'center',
      backgroundColor: '#f0f4f8',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      maxWidth: '800px',
      margin: 'auto',
    },
    heading: {
      fontSize: '2.5em',
      fontWeight: 'bold',
      color: '333',
      marginBottom: '20px',
    },
    formContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '15px',
      marginTop: '20px',
    },
    input: {
      width: '80%',
      padding: '12px',
      fontSize: '1.2em',
      borderRadius: '8px',
      border: '1px solid #ccc',
      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
      transition: 'border-color 0.2s ease',
    },
    button: {
      padding: '12px 20px',
      fontSize: '1.2em',
      backgroundColor: '#61dafb',
      color: '#fff',
      border: 'none',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      transition: 'background-color 0.3s ease',
    }
  };
  

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Meeting Calendar</h2>
      <FullCalendar plugins={[dayGridPlugin]} initialView="dayGridMonth" />
      <div style={styles.formContainer}>
        <input
          type="text"
          placeholder="Meeting Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={styles.input}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={styles.input}
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleSubmit} style={styles.button}>Submit Meeting</button>
      </div>
    </div>
  );
  
}

export default Calendar;
