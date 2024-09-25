import React, { Component } from "react";
import './Playlist.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faLockOpen, faHeart } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Global from '../../Global/Global';

export default class Playlists extends Component {
  state = {
    playlists: [],
    playlistsPublicas: [],
    playlistsPrivadas: [],
    playlistsSeguidas: [],
    activeCategory: 'seguidas', // Cambiado a 'seguidas' por defecto
    statusPlay: false,
    totalListas: 0,
    nombreUsuario: '',
  }

  offsetPlaylist = 0;

  componentDidMount() {
    this.getUsuario();
  }

  getUsuario = () => {
    const headers = {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem('access_token')
      }
    };

    axios.get("https://api.spotify.com/v1/me", headers).then(response => {
      const nombre = response.data.id;
      this.setState({
        nombreUsuario: nombre
      }, () => {
        this.getListas();
      });
    });
  }

  getListas = () => {
    const headers = {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem('access_token')
      }
    };

    axios.get("https://api.spotify.com/v1/me/playlists?limit=" + Global.playlistLimit + "&offset=" + this.offsetPlaylist, headers).then(response => {
      const datos = response.data;
      var totalListas = datos.total;

      if (this.offsetPlaylist < totalListas) {
        const newPlaylists = [...this.state.playlists];
        const newPlaylistsPublicas = [...this.state.playlistsPublicas];
        const newPlaylistsPrivadas = [...this.state.playlistsPrivadas];
        const newPlaylistsSeguidas = [...this.state.playlistsSeguidas];

        for (var i = 0; i < datos.items.length; i++) {
          newPlaylists.push(datos.items[i]);
          if (datos.items[i].public === true) {
            newPlaylistsPublicas.push(datos.items[i]);
          }
          if (datos.items[i].public === false && datos.items[i].owner.display_name === this.state.nombreUsuario) {
            newPlaylistsPrivadas.push(datos.items[i]);
          }
          if (datos.items[i].owner.display_name !== this.state.nombreUsuario) {
            newPlaylistsSeguidas.push(datos.items[i]);
          }
        }

        this.setState({
          playlists: newPlaylists,
          playlistsPublicas: newPlaylistsPublicas,
          playlistsPrivadas: newPlaylistsPrivadas,
          playlistsSeguidas: newPlaylistsSeguidas,
        }, () => {
          this.offsetPlaylist += Global.playlistLimit;
          this.getListas();
        });
      } else {
        this.setState({
          statusPlay: true,
          totalListas: totalListas,
        }, this.selectFirstSongFromFirstPlaylist);
      }
    }).catch(error => {
      console.error("Error fetching playlists:", error);
    });
  }
  // se obtiene la primera cancion de la playlist nada mas
  selectFirstSongFromFirstPlaylist = () => {
    if (this.state.playlistsSeguidas.length > 0) {
      const firstPlaylist = this.state.playlistsSeguidas[0];
      this.getPlaylistSongs(firstPlaylist);
    }
  }
  // se obtiene la primera cancion de la playlist nada mas
  getPlaylistSongs = (playlist) => {
    const headers = {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem('access_token')
      }
    };

    axios.get(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks`, headers)
      .then(response => {
        if (response.data.items.length > 0) {
          const firstSong = response.data.items[0].track;
          const songInfo = {
            id: firstSong.id,
            name: firstSong.name,
            artists: firstSong.artists.map(artist => artist.name).join(', '),
            albumImage: firstSong.album.images[0]?.url,
            previewUrl: firstSong.preview_url
          };
          this.props.onPlaylistSelect(playlist);
          this.props.onTrackSelect(songInfo);
        }
      })
      .catch(error => console.error("Error fetching playlist songs:", error));
  }

  handleCategoryClick = (category) => {
    this.setState({ activeCategory: category });
  }

  handlePlaylistClick = (playlist) => {
    this.props.onPlaylistSelect(playlist);
  }

  renderPlaylistButton = (playlist, index) => {
    const imageUrl = playlist.images && playlist.images.length > 0
      ? playlist.images[0].url
      : 'path/to/default/image.png';

    return (
      <button
        key={playlist.id + index}
        data-plistid={playlist.id}
        onClick={() => this.handlePlaylistClick(playlist)}
        className="btnPlist"
      >
        <img src={imageUrl} alt={playlist.name} className="playlist-thumbnail" />
        <span>{playlist.name === "" ? "Sin Nombre" : playlist.name}</span>
      </button>
    );
  }

  componentDidUpdate(prevProps, prevState) {
    // Cuando las playlists seguidas se cargan, selecciona la primera
    if (prevState.playlistsSeguidas.length === 0 && this.state.playlistsSeguidas.length > 0) {
      this.handlePlaylistClick(this.state.playlistsSeguidas[0]);
    }
  }

  render() {
    return (
      <div className="sidebar">
        <div className="listas">
          <div className="categories-container">
            <button
              onClick={() => this.handleCategoryClick('publicas')}
              className={`category-button ${this.state.activeCategory === 'publicas' ? 'active' : ''}`}
            >
              <FontAwesomeIcon icon={faLockOpen} className="icon" />Public
            </button>
            <button
              onClick={() => this.handleCategoryClick('privadas')}
              className={`category-button ${this.state.activeCategory === 'privadas' ? 'active' : ''}`}
            >
              <FontAwesomeIcon icon={faLock} className="icon" />Private
            </button>
            <button
              onClick={() => this.handleCategoryClick('seguidas')}
              className={`category-button ${this.state.activeCategory === 'seguidas' ? 'active' : ''}`}
            >
              <FontAwesomeIcon icon={faHeart} className="icon" />Liked
            </button>
          </div>
          <div className="playlists-list">
            {this.state.activeCategory === 'publicas' && this.state.playlistsPublicas.map(this.renderPlaylistButton)}
            {this.state.activeCategory === 'privadas' && this.state.playlistsPrivadas.map(this.renderPlaylistButton)}
            {this.state.activeCategory === 'seguidas' && this.state.playlistsSeguidas.map(this.renderPlaylistButton)}
          </div>
        </div>
      </div>
    );
  }
}
