import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { Button, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import { API_TOKEN, API_URL } from "../utils.js";
import { Search } from "./SearchAlbum.js";



export const AddAlbum = ({ fetchAlbums, fetchList, userId }) => {
  const [newAlbum, setNewAlbum] = useState("");
  const [albums, setAlbums] = useState([])

  const queryAlbum = async () => {
    console.log("searching for album!!")
    try {
      const response = await fetch(
        `https://api.discogs.com/database/search?q=${newAlbum}&type=master&token=${API_TOKEN}`
      );
      const data = await response.json();
      const results = data.results;

      console.log(results)
      //await fetchAlbums();
      setAlbums([])
      setAlbums(results)

      
    } catch (err) {
      console.log(err);
    }
  };
  

  return (
    
    <div>

      <div className="addAlbumForm">
        <TextField
          size="small"
          label="Album and/or Artist Name"
          variant="standard"
          //align="center"
          value={newAlbum}
          onChange={(e) => setNewAlbum(e.target.value)}
        />
        <Button
          disabled={!newAlbum.length}
          variant="outlined"
          onClick={queryAlbum}
        >
          <SearchIcon/>
        </Button>
          {albums.map((album) => (
            <Search album={album.title} image={album.cover_image} key={album.cover_image} fetchAlbums={fetchAlbums} fetchList={fetchList} userId={userId.userId}/>
          ))}
      </div>
    </div>
  );
};
