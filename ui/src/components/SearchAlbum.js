import { Button, Checkbox, Typography } from "@mui/material";
import React, { useState } from "react";
import DeleteIcom from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { UpdateAlbum } from "./UpdateAlbum";
import classnames from "classnames";
import axios from "axios";
import { API_URL } from "../utils";

export const Search = ({ album, image,  fetchAlbums }) => {
  //const { id, name, listened } = album;
  const [isListened, setIsListened] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [albums, setAlbums] = useState([])


  return (
    <div className="album">
      <div
        className={classnames("flex", {
          done: isListened,
        })}
      >
        <img src={image} width={150} height={150} alt="album logo" />
        <Typography variant="h4">{album}</Typography>
        
      </div>

      <UpdateAlbum
        fetchAlbums={fetchAlbums}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        album={album}
      />
    </div>
  );
};

/*    <div className="albumButtons">
<Button variant="contained" onClick={() => setIsDialogOpen(true)}>
<EditIcon></EditIcon>
</Button>
<Button variant="contained" color="error" onClick={handleDeleteAlbum}>
<DeleteIcom></DeleteIcom>
</Button>
</div>*/
