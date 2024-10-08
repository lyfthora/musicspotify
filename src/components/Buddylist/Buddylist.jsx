import React, { useState, useEffect } from 'react';
import './Buddylist.css';

const BuddyList = () => {
    const [buddies, setBuddies] = useState([
        { id: 1, name: 'Darkkal', status: 'online', currentTrack: '' },
        { id: 2, name: 'Brayan', status: 'offline', currentTrack: '' },
        { id: 3, name: 'Lalisa', status: 'offline', currentTrack: '' },
    ]);

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
        'Cinderella - Future, Metro Boomin, Travis Scott',
        'Die With A Smile - Lady Gaga, Bruno Mars',
        'Creepin - Metro Boomin, The Weekend, 21 Savage',
        'BABY - DJ Roots, Camo, Jey',
        'Low - SZA',
        'Condiciones - Maikel Delacalle',
        'act iii:on god - 4batz',
        'act i: stickerz 99 - 4batz',
        'Angel Numbers / Ten toes - Chris Brown',
    ];

    useEffect(() => {
        const changeSongForBuddy = (buddyId) => {
            setBuddies(prevBuddies =>
                prevBuddies.map(buddy => {
                    if (buddy.id === buddyId && buddy.status === 'online') {
                        return {
                            ...buddy,
                            currentTrack: songList[Math.floor(Math.random() * songList.length)]
                        };
                    }
                    return buddy;
                })
            );


            const randomTime = 15000 + Math.random() * 10000;
            setTimeout(() => changeSongForBuddy(buddyId), randomTime);
        };


        buddies.forEach(buddy => {
            if (buddy.status === 'online') {
                const initialDelay = 15000 + Math.random() * 10000; // cambio de song entre 15 - 25 segundos
                setTimeout(() => changeSongForBuddy(buddy.id), initialDelay);
            }
        });

        const statusInterval = setInterval(() => {
            setBuddies(prevBuddies =>
                prevBuddies.map(buddy => {
                    // Darkkal siempre onlineeeeeeeeeeeeeeeeeee
                    if (buddy.name === 'Darkkal') {
                        return { ...buddy, status: 'online' };
                    }

                    // 50% de chace entre online / offline xd
                    const newStatus = Math.random() > 0.5 ? 'online' : 'offline';
                    return {
                        ...buddy,
                        status: newStatus,
                        currentTrack: newStatus === 'online'
                            ? songList[Math.floor(Math.random() * songList.length)]
                            : ''
                    };
                })
            );
        }, 20000); // cambio status cada 20s

        return () => {
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