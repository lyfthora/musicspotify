import React, { Component } from 'react';
import axios from 'axios';
import Global from '../../Global/Global';
import './PlaylistSongs.css';
import figlet from 'figlet';



class PlaylistSongs extends Component {
    state = {
        songs: [],
        songsText: [],
        statusSong: false,
        statusLoading: true,
        imgP: '',
        nombreP: '',
        nombrePlaylistAscii: '',
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
        const nombreP = playlist.name;
        this.setState({ nombreP });

        this.setState({
            statusSong: false,
            statusLoading: true,
            imgP: playlist.images && playlist.images.length > 0 ? playlist.images[0].url : '',
        });


        figlet.text(nombreP, { font: '../../assets/fonts/Standard.flf' }, (err, data) => {
            if (!err) {
                this.setState({ nombrePlaylistAscii: data });
            } else {
                console.error("Error generating ASCII art:", err);
            }
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
                            : 'path/to/default/album/image.jpg';

                        let duration = track.duration_ms || 0; // este propiedad es para la duracion de la cancion (esta en milisegundos)
                        let min = Math.floor((duration / 1000 / 60) << 0); // este es para los minutos
                        let sec = Math.floor((duration / 1000) % 60); // este es para los segundos

                        if (sec.toString().length === 1) {
                            sec = "0" + sec;
                        }

                        this.auxSongs.push(
                            <tr
                                key={track.id + i}
                                onClick={() => this.handleTrackClick(track)}
                                className="clickableRow"
                            >
                                <td className="numeroCancion">{this.offsetSongs + i + 1}</td>
                                <td className="nombreCancion">
                                    <a href={albumImageUrl} target="blank">
                                        <img className="imagenCancion" alt="" src={albumImageUrl} />
                                    </a>
                                    <span className="nombreEspecial">{track.name || "Unknown Track"}</span>
                                </td>
                                <td className="artistaCancion"><span className="nombreEspecialArtista">{artists}</span></td>
                                <td className="albumCancion"><span className="nombreEspecialAlbum">{album}</span></td>
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

    handleTrackClick = (track) => {
        if (this.props.onTrackSelect) {
            this.props.onTrackSelect({
                uri: track.uri,
                name: track.name,
                artists: track.artists.map(artist => artist.name).join(", "),
                albumImage: track.album.images[0].url,
                previewUrl: track.preview_url,
                duration: track.duration_ms
            });
        }
    }

    render() {
        const { statusSong, statusLoading, imgP, nombrePlaylistAscii, songsText } = this.state;

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
                    <pre id="asciitext" style={{ float: 'left' }} className="ascii">
                        {nombrePlaylistAscii}
                    </pre>
                </div>
                <div className="divTablaCanciones">
                    <table className="tablaCanciones">
                        <thead className="infoCanciones">
                            <tr>
                                <th className="numeroCancion">#</th>
                                <th className="nombreCancion">Title</th>
                                <th className="artistaCancion">Artist</th>
                                <th className="albumCancion">Album</th>
                                <th className="duracionCancion">Duration</th>
                            </tr>
                        </thead>
                        <hr className="separadorInfoCanciones" />
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
