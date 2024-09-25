import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeDown, faVolumeUp } from '@fortawesome/free-solid-svg-icons';
import './Volume.css';

const Volume = ({ audioRef }) => {
    const [volume, setVolume] = useState(1);

    const handleVolumeChange = (newVolume) => {
        setVolume(newVolume);
        if (audioRef && audioRef.current) {
            audioRef.current.volume = newVolume;
        }
    };

    return (
        <div className="volume-control">
            <FontAwesomeIcon icon={faVolumeDown} />
            <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                className="volume-slider"
                style={{ "--volume-percentage": `${volume * 100}%` }}
            />
            <FontAwesomeIcon icon={faVolumeUp} />
        </div>
    );
};

export default Volume;
