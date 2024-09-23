import React, { useState, useEffect, useRef } from 'react';
import './Play.css';

const Play = ({ track }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(new Audio(track?.previewUrl));

    useEffect(() => {
        if (track?.previewUrl) {
            audioRef.current.src = track.previewUrl;
        }
    }, [track]);

    useEffect(() => {
        return () => {
            audioRef.current.pause();
        };
    }, []);

    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    if (!track) return null;

    return (
        <div className="player">
            <img src={track.albumImage} alt={track.name} className="album-cover" />
            <div className="track-info">
                <h3>{track.name}</h3>
                <p>{track.artists}</p>
            </div>
            <button onClick={togglePlay} className="play-button">
                {isPlaying ? "Pausa" : "Play"}
            </button>
        </div>
    );
};

export default Play;