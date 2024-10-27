import React from 'react';
import Calendar from './Calendar';

const MainPage = ({ isGuest }) => {
    return (
        <div className="bg-mesh2">
            <header className="flex justify-center p-5">
                <h1 className='text-3xl text-white font-extrabold'>Welcome to GatorSync</h1>
            </header>
            <main>
                <Calendar isGuest={isGuest} />
            </main>
        </div>
    );
};

export default MainPage;
