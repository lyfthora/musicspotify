import React, { useState, useEffect } from 'react';
import './Buddylist.css';

const BuddyList = () => {
    const [buddies, setBuddies] = useState([]);

    useEffect(() => {
        // Simular la carga de amigos
        const mockBuddies = [
            { id: 1, name: 'Darkkal', status: 'online', currentTrack: 'Shape of You - Ed Sheeran' },
            { id: 2, name: 'Brayan', status: 'offline', currentTrack: '' },
            { id: 3, name: 'Lalisa', status: 'online', currentTrack: 'Blinding Lights - The Weeknd' },

        ];

        setBuddies(mockBuddies);
    }, []);

    return (
        <div className="buddy-list">
            <div className="text-decoration-buddylist">Sidebar</div>
            <h2>Friends</h2>
            <ul>
                {buddies.map(buddy => (
                    <li key={buddy.id} className={`buddy ${buddy.status}`}>
                        <span className="buddy-name">{buddy.name}</span>
                        <span className="buddy-status">{buddy.status}</span>
                        {buddy.currentTrack && (
                            <span className="buddy-track">Listening to: {buddy.currentTrack}</span>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BuddyList;