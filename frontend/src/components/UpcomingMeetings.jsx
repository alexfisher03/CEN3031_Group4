import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UpcomingMeetings = ({ setUpdateMeetings }) => {
    const [meetings, setMeetings] = useState([]);

    const fetchMeetings = async () => {
        try {
            const response = await axios.get('/api/meetings/');
            const now = new Date();

            const sortedMeetings = response.data
                .filter((meeting) => new Date(`${meeting.date}T${meeting.end_time}`) > now)
                .sort((a, b) => new Date(`${a.date}T${a.start_time}`) - new Date(`${b.date}T${b.start_time}`));

            setMeetings(sortedMeetings);
        } catch (error) {
            console.error('Error fetching upcoming meetings:', error);
        }
    };

    useEffect(() => {
        setUpdateMeetings(() => fetchMeetings);
        fetchMeetings();
    }, [setUpdateMeetings]);

    return (
        <div>
            <h2 className="text-xl font-bold mb-4 pt-5">Upcoming Meetings</h2>
            <hr className="mb-3"></hr>
            <ul className="space-y-3">
                {meetings.map((meeting) => (
                    <li
                        key={meeting.id}
                        className="p-3 bg-mesh3 bg-cover rounded shadow flex flex-col hover:scale-105 duration-75"
                    >
                        <span className="font-semibold">{meeting.title}</span>
                        <span className="text-sm">
                            {new Date(meeting.date).toLocaleDateString()} •{' '}
                            {new Date(`${meeting.date}T${meeting.start_time}`).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                            })}{' '}
                            -{' '}
                            {new Date(`${meeting.date}T${meeting.end_time}`).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                            })}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UpcomingMeetings;