import React, { useState, useEffect, useRef } from 'react';
import './Play.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
import '../../index.css';
import Volume from '../volume/Volume';

const Play = ({ track }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const audioRef = useRef(new Audio());

    useEffect(() => {
        if (track?.previewUrl) {
            audioRef.current.src = track.previewUrl;
            setCurrentTime(0);
            setIsPlaying(false);
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
        if (isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const formatDuration = (duration_ms) => {
        if (!duration_ms) return '0:00';
        const totalSeconds = Math.floor(duration_ms / 1000);
        return formatTime(totalSeconds);
    };

    const trackDuration = track?.duration || 191000; // saldra 3:11 por default hasta que se haga click en una cancion :d

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
                                style={{ width: `${(currentTime / (trackDuration / 1000)) * 100}%` }}
                            ></div>
                            <div className="time-display">
                                {formatTime(currentTime)} / {formatDuration(trackDuration)}
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