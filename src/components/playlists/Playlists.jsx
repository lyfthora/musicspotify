import React, { Component } from "react";
import Global from "../../Global/Global";
import axios from "axios";
import './Playlist.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock, faLockOpen, faHeart } from '@fortawesome/free-solid-svg-icons'
import Header from "../header/Header";
import { Navigate } from "react-router-dom";
import { getRefreshedAccesToken } from "../../utils";


export default class Playlists extends Component {

  // searchParams = new URLSearchParams(window.location.search);
  // access_token = this.searchParams.get("access_token");

  access_token = localStorage.getItem('access_token');
  nombreUsuario = localStorage.getItem('user_id');



  state = {
    playlists: [],
    playlistsPublicas: [],
    playlistsPrivadas: [],
    playlistsSeguidas: [],
    statusPlay: false,
    statusLoading: false,
    total: 0,
    songs: [],
    songsText: [],
    statusSong: false,
    imgP: "",
    nombreP: "",
    nombreUsuario: ""
  }

  headers = {
    headers: {
      "Authorization": "Bearer " + this.access_token
    }
  }

  componentDidMount = () => {

    // console.log("en playlist: "+Global.access_token)
    this.getUsuario()
    this.getListas()
    getRefreshedAccesToken();
  }

  getUsuario = () => {
    axios.get("https://api.spotify.com/v1/me", this.headers).then(response => {
      const nombre = response.data.id
      this.setState({
        nombreUsuario: nombre
      })

    })
  }

  offsetPlaylist = 0;
  getListas = () => {
    axios.get(`https://api.spotify.com/v1/me/playlists?limit=${Global.playlistLimit}&offset=${this.offsetPlaylist}`, this.headers)
      .then(response => {
        const datos = response.data;
        const totalListas = datos.total;

        const playlists = [];
        const playlistsPublicas = [];
        const playlistsPrivadas = [];
        const playlistsSeguidas = [];

        datos.items.forEach(item => {
          playlists.push(item);
          if (item.public) {
            playlistsPublicas.push(item);
          } else if (item.owner.display_name === this.state.nombreUsuario) {
            playlistsPrivadas.push(item);
          } else {
            playlistsSeguidas.push(item);
          }
        });

        this.offsetPlaylist += Global.playlistLimit;
        if (this.offsetPlaylist < totalListas) {
          this.getListas();
        } else {
          this.setState({
            playlists,
            playlistsPublicas,
            playlistsPrivadas,
            playlistsSeguidas,
            statusPlay: true,
            totalListas,
          });
        }
      })
      .catch(error => {
        console.error('Error fetching playlists:', error);
        this.setState({ statusLoading: false });
      });
  }




  offsetSongs = 0;
  auxSongs = [];
  getCanciones = (playlist) => {
    const id = playlist.id;
    const total = playlist.tracks.total;

    this.setState({
      statusSong: false,
      statusLoading: true,
    });

    if (total === 0) {
      this.setState({
        statusSong: true,
        statusLoading: false,
      });
      return;
    }

    this.setState({
      imgP: playlist.images[0]?.url || '',
      nombreP: playlist.name || 'Desconocida',
    });

    axios.get(`https://api.spotify.com/v1/playlists/${id}/tracks?limit=${Global.songLimit}&offset=${this.offsetSongs}`, this.headers)
      .then(response => {
        const datos = response.data;
        console.log('Datos de la respuesta:', datos);

        if (datos.items.length > 0) {
          const songs = datos.items.map((item, i) => {
            const track = item.track;
            const artists = track.artists.map(artist => artist.name).join(', ');
            const album = track.album.name;
            const duration = track.duration_ms;
            const min = Math.floor(duration / 1000 / 60);
            const sec = Math.floor((duration / 1000) % 60).toString().padStart(2, '0');

            return (
              <tr key={track.id + i}>
                <td className="numeroCancion">{i + 1}</td>
                <td className="nombreCancion">
                  <a href={track.album.images[0]?.url} target="_blank" rel="noopener noreferrer">
                    <img className="imagenCancion" alt="" src={track.album.images[0]?.url} />
                  </a>
                  <span className="nombreEspecial">{track.name}</span>
                </td>
                <td className="artistaCancion"><span>{artists}</span></td>
                <td className="albumCancion"><span>{album}</span></td>
                <td className="duracionCancion">{min}:{sec}</td>
              </tr>
            );
          });

          this.auxSongs.push(...songs);
          this.offsetSongs += Global.songLimit;

          if (this.offsetSongs < total) {
            this.getCanciones(playlist);
          } else {
            this.setState({
              songs: this.auxSongs,
              songsText: this.auxSongs,
              statusSong: true,
              statusLoading: false,
            });
            this.auxSongs = [];
            this.offsetSongs = 0; // Reset offset after completing the loading
          }
        } else {
          this.setState({
            songs: this.auxSongs,
            songsText: this.auxSongs,
            statusSong: true,
            statusLoading: false,
          });
          this.auxSongs = [];
          this.offsetSongs = 0;
        }
      })
      .catch(error => {
        console.error('Error fetching songs:', error);
        this.setState({ statusLoading: false });
      });
  }


  // *RENDER
  render() {

    if (this.access_token === null) {
      return (<Navigate to="/" />)
    }


    return (
      <div>
        <Header seleccion="playlists" />
        <div className="general">
          <div className="playlists row mx-lg-5 mx-3">
            <div className="datosPlaylist col-sm-12 col-md-3 col-lg-3 p-0">
              <div className="totalPlaylists">
                <h1 className="numeroListas">PLAYLISTS: {this.state.totalListas}</h1>
              </div>
              <div className="listas">
                <details>
                  <summary><FontAwesomeIcon icon={faLockOpen} className="mx-2 icon" />Publicas</summary>
                  {/* CREACION DE BOTONES */}
                  {
                    this.state.playlistsPublicas.map((playlist, index) => {
                      return (
                        <button key={playlist.id + index} data-plistid={playlist.id} onClick={() => this.getCanciones(playlist)} className="btnPlist">
                          {
                            (playlist.name === "") ?
                              ("Sin Nombre") :
                              (playlist.name)
                          }
                        </button>
                      )
                    })
                  }
                </details>
                <details>
                  <summary><FontAwesomeIcon icon={faLock} className="mx-2 icon" />Privadas</summary>
                  {
                    this.state.playlistsPrivadas.map((playlist, index) => {
                      return (
                        <button key={playlist.id + index} data-plistid={playlist.id} onClick={() => this.getCanciones(playlist)} className="btnPlist">
                          {
                            (playlist.name === "") ?
                              ("Sin Nombre") :
                              (playlist.name)
                          }
                        </button>
                      )
                    })
                  }
                </details>
                <details>
                  <summary><FontAwesomeIcon icon={faHeart} className="mx-2 icon" />Seguidas</summary>
                  {
                    this.state.playlistsSeguidas.map((playlist, index) => {
                      return (
                        <button key={playlist.id + index} data-plistid={playlist.id} onClick={() => this.getCanciones(playlist)} className="btnPlist">
                          {
                            (playlist.name === "") ?
                              ("Sin Nombre") :
                              (playlist.name)
                          }
                        </button>
                      )
                    })
                  }
                </details>
              </div>
            </div>

            {
              (this.state.statusSong === true) ?
                (
                  <div className="canciones p-0 col-sm-12 col-md-9 col-lg-9">
                    <div className="infoLista">
                      <img className="imgLista" src={this.state.imgP} alt=""></img>
                      <h3 className="nombrePlaylist">{this.state.nombreP}</h3>
                    </div>
                    <div className="divTablaCanciones">
                      <table className="tablaCanciones">
                        <thead>
                          <tr>
                            <th className="col-xs-1 numeroCancion">#</th>
                            <th className="col-xs-4 nombreCancion ">NOMBRE</th>
                            <th className="col-xs-3 artistaCancion ">ARTISTA</th>
                            <th className="col-xs-2 albumCancion ">ALBUM</th>
                            <th className="col-xs-1 duracionCancion">DURACION</th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.songsText}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) :
                (this.state.statusLoading === true) ?
                  (
                    <div className="canciones col-sm-12 col-md-9 col-lg-9">
                      <div className="load">
                        <h1>CARGANDO...</h1>
                        <div className="mx-auto carga"></div>
                      </div>
                    </div>
                  ) :
                  (
                    <div className="canciones p-0 col-sm-12 col-md-9 col-lg-9">
                      <div className="noSongs">
                        <h1>NO HAS SELECIONADO UNA PLAYLIST</h1>
                      </div>
                    </div>
                  )
            }

          </div>
        </div>
      </div>
    );
  }
}
