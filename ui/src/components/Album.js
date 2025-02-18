import { Button, Checkbox, Typography } from "@mui/material";
import React, { useState } from "react";
import DeleteIcom from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { UpdateAlbum } from "./UpdateAlbum";
import classnames from "classnames";
import axios from "axios";
import { API_URL } from "../utils";
import { useEffect } from "react";
import Divider from '@mui/material/Divider';



export const Album = ({ album, fetchAlbums, fetchList }) => {
  const { id, name, listened, image } = album;
  const [isListened, setIsListened] = useState(listened);
  const [isDialogOpen, setIsDialogOpen] = useState(false);


  useEffect(() => {
    setIsListened(listened);
  }, [listened]);


  const handleUpdateAlbum = async () => {
    try {
      const new_listened = isListened === 0 ? 1 : 0;

      await axios.put(API_URL+"album", {
        id, name, listened: new_listened,
      })
      setIsListened(new_listened);
      await fetchAlbums();
      await fetchList();
    } catch (err) {
      console.log(err)
      
    }
    
  };

  const handleDeleteAlbum = async () => {

    try {

      await axios.delete(`${API_URL+"album"}/${album.id}`);
      await fetchAlbums();
      await fetchList();

    } catch (err) {
      console.log(err)
      
    }
    console.log("album deleted!!");
  };

  return (
    <div className="album">
      <div className={classnames("flex")} style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Checkbox checked={isListened === 1} onChange={handleUpdateAlbum} />
          <img src={image} width={150} height={150} alt="album logo" />
        </div>

        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: "8px" }}>  
          <Typography variant="h4">{name}</Typography>
      

      <div className="albumButtons" style={{ marginTop: "10px", display: "flex", gap: "8px" }}>
        <Button variant="contained" onClick={() => setIsDialogOpen(true)}>
          <EditIcon></EditIcon>
        </Button>
        <Button variant="contained" color="error" onClick={handleDeleteAlbum}>
          <DeleteIcom></DeleteIcom>
        </Button>
        </div>
      <UpdateAlbum
        fetchAlbums={fetchAlbums}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        album={album}
      />
        </div>
      </div>
      <Divider sx={ {mt: 2, mb: 2, border: '1px solid', borderColor: 'divider'}} variant="middle"  />
    </div>
  );
};
