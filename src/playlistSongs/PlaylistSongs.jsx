import React, { Component } from 'react';
import axios from 'axios';
import Global from '../Global/Global';
import './PlaylistSongs.css';

class PlaylistSongs extends Component {
    state = {
        songs: [],
        songsText: [],
        statusSong: false,
        statusLoading: true,
        imgP: '',
        nombreP: '',
    };

    offsetSongs = 0;
    auxSongs = [];

    componentDidMount() {
        this.getCanciones(this.props.playlist);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.playlist.id !== this.props.playlist.id) {
            this.offsetSongs = 0;
            this.auxSongs = [];
            this.getCanciones(this.props.playlist);
        }
    }

    getCanciones = (playlist) => {
        const id = playlist.id;
        const total = playlist.tracks.total;

        this.setState({
            statusSong: false,
            statusLoading: true,
            imgP: playlist.images && playlist.images.length > 0 ? playlist.images[0].url : '',
            nombreP: playlist.name,
        });

        if (total !== 0) {
            axios.get(`https://api.spotify.com/v1/playlists/${id}/tracks?limit=${Global.songLimit}&offset=${this.offsetSongs}`, this.props.headers)
                .then(response => {
                    const datos = response.data;

                    const availableTracks = datos.items.filter(item => item.track && !item.track.is_local);

                    for (let i = 0; i < availableTracks.length; i++) {
                        const track = availableTracks[i].track;

                        let artists = track.artists ? track.artists.map(artist => artist.name).join(", ") : "Unknown Artist";
                        let album = track.album && track.album.name ? track.album.name : "Unknown Album";
                        let albumImageUrl = track.album && track.album.images && track.album.images.length > 0
                            ? track.album.images[0].url
                            : 'path/to/default/album/image.jpg'; // Asegúrate de tener una imagen por defecto

                        let duration = track.duration_ms || 0;
                        let min = Math.floor((duration / 1000 / 60) << 0);
                        let sec = Math.floor((duration / 1000) % 60);

                        if (sec.toString().length === 1) {
                            sec = "0" + sec;
                        }

                        this.auxSongs.push(
                            <tr key={track.id + i}>
                                <td className="numeroCancion">{this.offsetSongs + i + 1}</td>
                                <td className="nombreCancion">
                                    <a href={albumImageUrl} target="blank">
                                        <img className="imagenCancion" alt="" src={albumImageUrl} />
                                    </a>
                                    <span className="nombreEspecial">{track.name || "Unknown Track"}</span>
                                </td>
                                <td className="artistaCancion"><span>{artists}</span></td>
                                <td className="albumCancion"><span>{album}</span></td>
                                <td className="duracionCancion">{min}:{sec}</td>
                            </tr>
                        );
                    }

                    if (this.offsetSongs + Global.songLimit < total) {
                        this.offsetSongs += Global.songLimit;
                        this.getCanciones(playlist);
                    } else {
                        this.setState({
                            songs: this.auxSongs,
                            songsText: this.auxSongs,
                            statusSong: true,
                            statusLoading: false,
                        });
                        this.offsetSongs = 0;
                        this.auxSongs = [];
                    }
                })
                .catch(error => {
                    console.error("Error fetching songs:", error);
                    this.setState({ statusLoading: false, statusSong: false });
                });
        } else {
            this.setState({
                statusLoading: false,
                statusSong: false,
            });
        }
    }

    render() {
        const { statusSong, statusLoading, imgP, nombreP, songsText } = this.state;

        if (statusLoading) {
            return (
                <div className="load">
                    <h1>CARGANDO...</h1>
                    <div className="carga"></div>
                </div>
            );
        }

        if (!statusSong) {
            return (
                <div className="noSongs">
                    <h1>NO HAY CANCIONES EN ESTA PLAYLIST</h1>
                </div>
            );
        }

        return (
            <div className="canciones">
                <div className="infoLista">
                    <img className="imgLista" src={imgP} alt="" />
                    <h3 className="nombrePlaylist">{nombreP}</h3>
                </div>
                <div className="divTablaCanciones">
                    <table className="tablaCanciones">
                        <thead>
                            <tr>
                                <th className="numeroCancion">#</th>
                                <th className="nombreCancion">NOMBRE</th>
                                <th className="artistaCancion">ARTISTA</th>
                                <th className="albumCancion">ALBUM</th>
                                <th className="duracionCancion">DURACION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {songsText}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default PlaylistSongs;