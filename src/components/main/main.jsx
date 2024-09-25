import React, { useState, useEffect } from 'react';
import { Navigate } from "react-router-dom";
import Header from '../header/Header';
import Playlists from '../playlists/Playlists';
import Pages from '../pages/pages';
import PlaylistSongs from '../playlistSongs/PlaylistSongs';
import Play from '../play/Play';
import BuddyList from '../Buddylist/Buddylist';
import '../../index.css';

function Main() {
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [selectedTrack, setSelectedTrack] = useState(null);
    const [accessToken, setAccessToken] = useState(localStorage.getItem('access_token'));

    const headers = {
        headers: {
            "Authorization": "Bearer " + accessToken
        }
    };

    useEffect(() => {
        if (!accessToken) {
            console.error("No access token found");
        }
    }, [accessToken]);

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
                        <Playlists
                            onPlaylistSelect={handlePlaylistSelect}
                            setInitialPlaylist={setSelectedPlaylist}
                            onTrackSelect={handleTrackSelect}
                            headers={headers}
                        />
                    </div>
                    <div className="content">
                        {selectedPlaylist ? (
                            <PlaylistSongs
                                playlist={selectedPlaylist}
                                headers={headers}
                                onTrackSelect={handleTrackSelect}
                                setInitialTrack={setSelectedTrack}
                            />
                        ) : (
                            <div className="noSongs">
                                <h1>Cargando playlist...</h1>
                            </div>
                        )}
                    </div>
                    <div className="buddy-list-container">
                        <BuddyList />
                    </div>
                </div>
            </div>
            <div className="player-container">
                <Play track={selectedTrack} />

            </div>
        </div>
    );
}

export default Main;