import React, { useState, useEffect, useRef } from 'react';
import './Play.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
import Volume from '../volume/Volume';
import '../../index.css';
const Play = ({ track }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const audioRef = useRef(new Audio());

    useEffect(() => {
        if (track?.previewUrl) {
            audioRef.current.src = track.previewUrl;
            setCurrentTime(0);
        }
    }, [track]);

    useEffect(() => {
        const audio = audioRef.current;
        const updateTime = () => setCurrentTime(audio.currentTime);
        audio.addEventListener('timeupdate', updateTime);

        return () => {
            audio.removeEventListener('timeupdate', updateTime);
            audio.pause();
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

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <div className="player">
            {track ? (
                <>
                    <div className="player-content">
                        <img src={track.albumImage} alt={track.name} className="album-cover" />
                        <div className="track-info">
                            <h3>{track.name}</h3>
                            <p>{track.artists}</p>
                        </div>
                        <button onClick={togglePlay} className="play-button">
                            {isPlaying ? <FontAwesomeIcon icon={faPause} /> : <FontAwesomeIcon icon={faPlay} />}
                        </button>
                        <Volume audioRef={audioRef} />
                    </div>
                    <div className="player-progress">
                        <div className="progress-bar">
                            <div
                                className="progress"
                                style={{ width: `${(currentTime / 30) * 100}%` }}
                            ></div>
                            <div className="time-display">
                                {formatTime(currentTime)} / 0:30
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <p>No hay pista seleccionada</p>
            )}
        </div>
    );
};

export default Play;