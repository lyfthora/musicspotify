import React, { useState } from 'react';
import Header from '../header/Header';
import Playlists from '../playlists/Playlists';
import Pages from '../pages/pages';
import PlaylistSongs from '../playlists/PlaylistSongs';
import { Navigate } from "react-router-dom";

function Main() {
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const access_token = localStorage.getItem('access_token');

    const headers = {
        headers: {
            "Authorization": "Bearer " + access_token
        }
    };

    if (access_token === null) {
        return (<Navigate to="/" />);
    }

    const handlePlaylistSelect = (playlist) => {
        setSelectedPlaylist(playlist);
    };

    return (
        <div>
            <Header seleccion="playlists" />
            <div className="general">
                <div className="playlists-container">
                    <div className="sidebar-container">
                        <Pages />
                        <Playlists onPlaylistSelect={setSelectedPlaylist} />
                    </div>
                    <div className="content">
                        {selectedPlaylist ? (
                            <PlaylistSongs
                                playlist={selectedPlaylist}
                                headers={headers}
                            />
                        ) : (
                            <div className="noSongs">
                                <h1>NO HAS SELECCIONADO UNA PLAYLIST</h1>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Main;