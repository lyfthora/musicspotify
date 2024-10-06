import React, { useState, useEffect } from 'react';
import './Buddylist.css';

const BuddyList = () => {
    const [buddies, setBuddies] = useState([]);

    // Lista de canciones
    const songList = [
        'Shape of You - Ed Sheeran',
        'Blinding Lights - The Weeknd',
        'Levitating - Dua Lipa',
        'Heartburn - Wafia',
        'Drivers License - Olivia Rodrigo',
        'Glory Box - Portishead',
        'It Will Rain - Bruno Mars',
        'Cigarettes & Alcochol - Santino Le Saint',
        'Smiles - SoLonely',
        'Moonchasers - LVNDVN',
        'Cinderella - Future, Metro Boomin, Travis Scott'
    ];

    useEffect(() => {
        const friendos = [
            { id: 1, name: 'Darkkal', status: 'online', currentTrack: songList[Math.floor(Math.random() * songList.length)] },
            { id: 2, name: 'Brayan', status: 'offline', currentTrack: '' },
            { id: 3, name: 'Lalisa', status: 'offline', currentTrack: songList[Math.floor(Math.random() * songList.length)] },
        ];

        setBuddies(friendos);


        const songInterval = setInterval(() => {
            setBuddies(prevBuddies =>
                prevBuddies.map(buddy => {
                    if (buddy.status === 'online') {
                        const randomSong = songList[Math.floor(Math.random() * songList.length)];
                        return { ...buddy, currentTrack: randomSong };
                    }
                    return buddy;
                })
            );
        }, 10000); // 10 segundos

        const statusInterval = setInterval(() => {
            setBuddies(prevBuddies =>
                prevBuddies.map(buddy => {
                    // siempre haya 1 online --- al haber 3 offline se cambia el tamaño (arreglar)
                    if (buddy.name === 'Darkkal') {
                        return {
                            ...buddy,
                            status: 'online',
                            currentTrack: songList[Math.floor(Math.random() * songList.length)]
                        };
                    }
                    // 50% tiene cada status xd
                    const newStatus = Math.random() > 0.5 ? 'online' : 'offline';
                    const newTrack = newStatus === 'online'
                        ? songList[Math.floor(Math.random() * songList.length)]
                        : '';
                    return {
                        ...buddy,
                        status: newStatus,
                        currentTrack: newTrack
                    };
                })
            );
        }, 20000); // 20 segundos

        return () => {
            clearInterval(songInterval);
            clearInterval(statusInterval);
        };
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
                        {buddy.status === 'online' && buddy.currentTrack ? (
                            <span className="buddy-track">Listening to: {buddy.currentTrack}</span>
                        ) : (
                            <span className="buddy-track" aria-hidden="true"></span>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BuddyList;
