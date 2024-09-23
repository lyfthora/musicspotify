const Global = {
  playlistLimit: process.env.REACT_APP_PLAYLIST_LIMIT,
  songLimit: process.env.REACT_APP_SONG_LIMIT,
  redirect_uri: process.env.REACT_APP_REDIRECT_URI,
  client_id: process.env.REACT_APP_CLIENT_ID,
  client_secret: process.env.REACT_APP_CLIENT_SECRET,
  scopes: process.env.REACT_APP_SCOPES,
  get access_token() {
    return localStorage.getItem("access_token");
  },
};

export default Global;
