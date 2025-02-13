import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { Button, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { API_TOKEN, API_URL } from "../utils.js";
import { Search } from "./SearchAlbum.js";


export const AddAlbum = ({ searchAlbums }) => {
  const [newAlbum, setNewAlbum] = useState("");
  const [albums, setAlbums] = useState([])

  const addNewAlbum = async () => {
    console.log("new album added!!")
    try {
      await axios.post(API_URL, {
        name: newAlbum,
        listened: false,
      });

      await searchAlbums();

      setNewAlbum("");
    } catch (err) {
      console.log(err);
    }
  };

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
          label="Album Name"
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
          <AddIcon/>
        </Button>
          {albums.map((album) => (
            <Search album={album.title} image={album.cover_image} key={album.cover_image} fetchAlbums={queryAlbum} />
          ))}
      </div>
    </div>
  );
};
