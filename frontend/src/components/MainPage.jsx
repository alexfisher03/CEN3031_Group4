import React, { useState } from 'react';
import Calendar from './Calendar';
import UpcomingMeetings from './UpcomingMeetings';

const MainPage = ({ isGuest }) => {
    const [updateMeetings, setUpdateMeetings] = useState(() => () => {});

    return (
        <div className="bg-mesh2 bg-cover min-h-screen flex flex-col">
            <header className="flex justify-center pt-12 pb-5">
                <h1 className="text-3xl text-white font-extrabold">Welcome to GatorSync</h1>
            </header>
            <main className="flex flex-grow p-4">
                <div className="flex-grow flex justify-end pr-4">
                    <div className="scale-90 md:scale-100 max-w-3xl w-full">
                        <Calendar isGuest={isGuest} onMeetingAdded={() => updateMeetings()} />
                    </div>
                </div>

                <div className="w-1/4 min-w-[200px] bg-gray-700 rounded-lg p-4 text-white">
                    <UpcomingMeetings setUpdateMeetings={setUpdateMeetings} />
                </div>
            </main>
            <footer className="flex justify-center pt-3 pb-12 text-white">
                <div className="text-center">
                    <p>Created By Group 4 - The Bug Squashers</p>
                    <p>CEN3031: University of Florida - Fall 2024</p>
                    <a
                        href="https://github.com/alexfisher03/CEN3031_Group4"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#ff00ee] transition-colors"
                    >
                        * 💻 GitHub Repository *
                    </a>
                </div>
            </footer>
        </div>
    );
};

export default MainPage;
