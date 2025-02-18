import { Button, Checkbox, Typography } from "@mui/material";
import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { UpdateAlbum } from "./UpdateAlbum";
import classnames from "classnames";
import axios from "axios";
import { API_URL } from "../utils";

export const Search = ({ album, image,  fetchAlbums, fetchList }) => {
  //const { id, name, listened } = album;
  const [isListened, setIsListened] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [albums, setAlbums] = useState([])

  const addNewAlbum = async () => {
    console.log("new album added!!")
    try {
      await axios.post(API_URL+"album", {
        name: album,
        listened: 0,
        image: image,
      });

      await fetchAlbums();
      await fetchList();

      // setNewAlbum("");
    } catch (err) {
      console.log(err);
    }
  };

  const addListenedAlbum = async () => {
    console.log("new album listened to!!")
    try {
      await axios.post(API_URL+"album", {
        name: album,
        listened: 1,
        image: image,
      });

      await fetchAlbums();
      await fetchList();

      // setNewAlbum("");
    } catch (err) {
      console.log(err);
    }
  };


  return (
    <div className="album">
      <div
        className={classnames("flex")}
      >
        <img src={image} width={150} height={150} alt="album logo" />
        <Typography variant="h4">{album}</Typography>
      </div>
      <div className="albumButtons">
        <Button variant="contained" color="success"  onClick={addNewAlbum}>
          Add Album to Listen List<AddIcon></AddIcon>
        </Button>
        <Button variant="contained" color="success"  onClick={addListenedAlbum}>
          Already Listened to Album<AddIcon></AddIcon>
        </Button>
      </div>


    </div>
  );
};

