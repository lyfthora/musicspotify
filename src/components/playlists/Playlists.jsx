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
    activeCategory: null,
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
        });
      }
    }).catch(error => {
      console.error("Error fetching playlists:", error);
    });
  }

  handleCategoryClick = (category) => {
    this.setState(prevState => ({
      activeCategory: prevState.activeCategory === category ? null : category
    }));
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
