import { Button, Checkbox, Typography } from "@mui/material";
import React, { useState } from "react";
import DeleteIcom from "@mui/icons-material/Delete";
import HeadphonesIcon from '@mui/icons-material/Headphones';
import HeadsetOffIcon from '@mui/icons-material/HeadsetOff';
import { UpdateAlbum } from "./UpdateAlbum";
import classnames from "classnames";
import axios from "axios";
import { API_URL } from "../utils";
import { useEffect } from "react";
import Divider from '@mui/material/Divider';




export const Album = ({ album, fetchAlbums, fetchList, userId}) => {
  const { id, name, listened, image } = album;
  const [isListened, setIsListened] = useState(listened);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);


  useEffect(() => {
    setIsListened(listened);
  }, [listened]);


  const handleUpdateAlbum = async () => {
    try {
      const new_listened = isListened === 0 ? 1 : 0;
      const uID = userId.userId
      await axios.put(API_URL+"album", {
        id, name, listened: new_listened, uID
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
          {/* <Checkbox checked={isListened === 1} onChange={handleUpdateAlbum} /> */}

          <img src={image} width={150} height={150} alt="album logo" />
        </div>

        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: "8px" }}>  
          <Typography variant="h4">{name}</Typography>
      


      <div className="albumButtons" style={{ marginTop: "10px", display: "flex", gap: "8px" }}>
          
          <div 
        onMouseEnter={() => setIsHovered(true)} 
        onMouseLeave={() => setIsHovered(false)}
      >
        
        <Button variant="contained" onClick={handleUpdateAlbum}>
        {isHovered ? (
          isListened ? <HeadsetOffIcon /> : <HeadphonesIcon />
        ) : (
          isListened ? <HeadphonesIcon /> : <HeadsetOffIcon />
        )}        
        </Button>

        
        </div>
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
