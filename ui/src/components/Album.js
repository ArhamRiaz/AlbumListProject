import { Button, Checkbox, Typography } from "@mui/material";
import React, { useState } from "react";
import DeleteIcom from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { UpdateAlbum } from "./UpdateAlbum";
import classnames from "classnames";
import axios from "axios";
import { API_URL } from "../utils";

export const Album = ({ album, fetchAlbums }) => {
  const { id, name, listened } = album;
  const [isListened, setIslListened] = useState(listened);
  const [isDialogOpen, setisDialogOpen] = useState(false);

  const handleUpdateAlbum = async () => {
    try {
      await axios.put(API_URL, {
        id, name, listened: !isListened,
      })
      setIslListened((prev) => !prev);
    } catch (err) {
      console.log(err)
      
    }
    
  };

  const handleDeleteAlbum = async () => {

    try {

      await axios.delete(`${API_URL}/${album.id}`);
      await fetchAlbums();

    } catch (error) {
      console.log(err)
      
    }
    console.log("album deleted!!");
  };

  return (
    <div className="album">
      <div
        className={classnames("flex", {
          done: isListened,
        })}
      >
        <Checkbox checked={isListened} onChange={handleUpdateAlbum} />
        <Typography variant="h4">{name}</Typography>
      </div>
      <div className="albumButtons">
        <Button variant="contained" onClick={() => setisDialogOpen(true)}>
          <EditIcon></EditIcon>
        </Button>
        <Button variant="contained" color="error" onClick={handleDeleteAlbum}>
          <DeleteIcom></DeleteIcom>
        </Button>
      </div>
      <UpdateAlbum
        fetchAlbums={fetchAlbums}
        isDialogOpen={isDialogOpen}
        setisDialogOpen={setisDialogOpen}
        album={album}
      />
    </div>
  );
};
