import React from 'react';
import Calendar from './Calendar';

const MainPage = () => {
    return (
        <div>
            <header>
                <h1>GatorSync</h1>
                <div className="account-info">
                    <img src="account-icon.png" alt="Account" />
                    {/* Display user info on hover */}
                </div>
            </header>
            <main>
                <Calendar />
            </main>
        </div>
    );
};

export default MainPage;