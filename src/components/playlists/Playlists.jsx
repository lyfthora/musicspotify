import React, { Component } from "react";
import './Playlist.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faLockOpen } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Global from '../../Global/Global';

export default class Playlists extends Component {
  state = {
    playlists: [],
    playlistsPublicas: [],
    playlistsPrivadas: [],
    activeCategory: 'privadas',
    statusPlay: false,
    totalListas: 0,
    nombreUsuario: '',
  }

  offsetPlaylist = 0;

  componentDidMount() {
    this.fetchUserData();
  }

  fetchUserData = () => {
    const headers = { Authorization: "Bearer " + localStorage.getItem('access_token') };

    axios.get("https://api.spotify.com/v1/me", { headers })
      .then(({ data }) => {
        this.setState({ nombreUsuario: data.id }, this.fetchPlaylists);
      })
      .catch(error => console.error("Error fetching user data:", error));
  }

  fetchPlaylists = () => {
    const headers = { Authorization: "Bearer " + localStorage.getItem('access_token') };

    axios.get(`https://api.spotify.com/v1/me/playlists?limit=${Global.playlistLimit}&offset=${this.offsetPlaylist}`, { headers })
      .then(({ data }) => {
        if (this.offsetPlaylist < data.total) {
          const playlists = data.items;
          this.setState(prevState => ({
            playlists: [...prevState.playlists, ...playlists],
            playlistsPublicas: [...prevState.playlistsPublicas, ...playlists.filter(p => p.public)],
            playlistsPrivadas: [...prevState.playlistsPrivadas, ...playlists.filter(p => !p.public && p.owner.id === prevState.nombreUsuario)],
            totalListas: data.total,
          }), () => {
            this.offsetPlaylist += Global.playlistLimit;
            this.fetchPlaylists();
          });
        } else {
          this.setState({ statusPlay: true }, this.selectFirstSongFromFirstPlaylist);
        }
      })
      .catch(error => console.error("Error fetching playlists:", error));
  }

  selectFirstSongFromFirstPlaylist = () => {
    if (this.state.playlistsPrivadas.length > 0) {
      this.fetchFirstSong(this.state.playlistsPrivadas[0]);
    }
  }

  fetchFirstSong = (playlist) => {
    const headers = { Authorization: "Bearer " + localStorage.getItem('access_token') };

    axios.get(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks`, { headers })
      .then(({ data }) => {
        if (data.items.length > 0) {
          const firstSong = data.items[0].track;
          const songInfo = {
            id: firstSong.id,
            name: firstSong.name,
            artists: firstSong.artists.map(artist => artist.name).join(', '),
            albumImage: firstSong.album.images[0]?.url,
            previewUrl: firstSong.preview_url,
          };
          this.props.onPlaylistSelect(playlist);
          this.props.onTrackSelect(songInfo);
        }
      })
      .catch(error => console.error("Error fetching playlist songs:", error));
  }

  handleCategoryClick = (category) => this.setState({ activeCategory: category });

  handlePlaylistClick = (playlist) => this.props.onPlaylistSelect(playlist);

  renderPlaylistButton = (playlist) => (
    <button
      key={playlist.id}
      onClick={() => this.handlePlaylistClick(playlist)}
      className="btnPlist"
    >
      <img src={playlist.images?.[0]?.url || 'path/to/default/image.png'} alt={playlist.name || "Sin Nombre"} className="playlist-thumbnail" />
      <span>{playlist.name || "Sin Nombre"}</span>
    </button>
  );

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.playlistsPrivadas.length && this.state.playlistsPrivadas.length) {
      this.handlePlaylistClick(this.state.playlistsPrivadas[0]);
    }
  }

  render() {
    const { playlistsPublicas, playlistsPrivadas, activeCategory } = this.state;

    return (
      <div className="sidebar">
        <div className="text-decoration-playlist">Playlist</div>
        <div className="listas">
          <div className="categories-container">
            {['publicas', 'privadas'].map(category => (
              <button
                key={category}
                onClick={() => this.handleCategoryClick(category)}
                className={`category-button ${activeCategory === category ? 'active' : ''}`}
              >
                <FontAwesomeIcon icon={category === 'publicas' ? faLockOpen : faLock} className="icon" />
                {category === 'publicas' ? 'Public' : 'Private'}
              </button>
            ))}
          </div>
          <div className="playlists-list">
            {activeCategory === 'publicas' && playlistsPublicas.map(this.renderPlaylistButton)}
            {activeCategory === 'privadas' && playlistsPrivadas.map(this.renderPlaylistButton)}
          </div>
        </div>
      </div>
    );
  }
}