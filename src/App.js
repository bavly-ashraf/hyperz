import React from 'react';
import {useEffect, useState} from 'react';
import axios from 'axios';
import './App.css';

function App() {
  //<input type="text" onChange={e => setSearchKey(e.target.value)}/>
  const CLIENT_ID = "a9c5d03f16034cd7b1d7f77cb9fc90fb"
const REDIRECT_URI = "http://localhost:3000"
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
const RESPONSE_TYPE = "token"

const [token, setToken] = useState("")

//const [searchKey, setSearchKey] = useState("")
const [artists, setArtists] = useState([])

useEffect(() => {
  const hash = window.location.hash
  let token = window.localStorage.getItem("token")

  if (!token && hash) {
      token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

      window.location.hash = ""
      window.localStorage.setItem("token", token)
  }

  setToken(token)

}, [])

const logout = () => {
  setToken("")
  window.localStorage.removeItem("token")



}
const searchArtists = async (e) => {
  e.preventDefault()
  const {data} = await axios.get("https://api.spotify.com/v1/search", {
      headers: {
          Authorization: `Bearer ${token}`
      },
      params: {
          q: e.target.value,
          type: "artist"
      }
  })

  setArtists(data.artists.items)
}
const renderArtists = () => {
  return artists.map(artist => (
      <div key={artist.id}>
        {artist.name}
          {artist.images.length ? <img width={"100%"} src={artist.images[0].url} alt=""/> : <div>No Image</div>}
          
      </div>
  ))
}

  return (
    <header className="App-header">
    <h1>HyperZ</h1>
    {!token ?
        <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>Login
            to Spotify</a>
        : <button onClick={logout}>Logout</button>}
        <form onSubmit={searchArtists}>
        <input type="text" placeholder='Enter Artist Name' onChange={searchArtists}/>
    <button type={"submit"}>Search</button>
</form>
{renderArtists()}
</header>
);
}

export default App;
