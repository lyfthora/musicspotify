import React, { useState, useEffect } from 'react';
import { Navigate } from "react-router-dom";
import Header from '../header/Header';
import Playlists from '../playlists/Playlists';
import Pages from '../pages/pages';
import PlaylistSongs from '../../playlistSongs/PlaylistSongs';
import Play from '../play/Play';
import '../../index.css';

function Main() {
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [selectedTrack, setSelectedTrack] = useState(null);
    const [accessToken, setAccessToken] = useState(localStorage.getItem('access_token'));

    useEffect(() => {
        if (!accessToken) {
            // Redirigir al usuario a la página de inicio de sesión o mostrar un mensaje de error
            console.error("No access token found");
        }
    }, [accessToken]);

    const headers = {
        headers: {
            "Authorization": "Bearer " + accessToken
        }
    };

    if (!accessToken) {
        return <Navigate to="/" />;
    }

    const handlePlaylistSelect = (playlist) => {
        setSelectedPlaylist(playlist);
    };

    const handleTrackSelect = (trackInfo) => {
        setSelectedTrack(trackInfo);
    };

    return (
        <div className="main-container">
            <Header seleccion="playlists" />
            <div className="general">
                <div className="playlists-container">
                    <div className="sidebar-container">
                        <Pages />
                        <Playlists onPlaylistSelect={handlePlaylistSelect} />
                    </div>
                    <div className="content">
                        {selectedPlaylist ? (
                            <PlaylistSongs
                                playlist={selectedPlaylist}
                                headers={headers}
                                onTrackSelect={handleTrackSelect}
                            />
                        ) : (
                            <div className="noSongs">
                                <h1>NO HAS SELECCIONADO UNA PLAYLIST</h1>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {selectedTrack && (
                <div className="player-container">
                    <Play track={selectedTrack} />
                </div>
            )}
        </div>
    );
}

export default Main;