import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { Button, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { API_URL } from "../utils.js";

export const AddAlbum = ({ fetchTasks }) => {
  const [newTask, setNewTask] = useState("");

  const addNewTask = async () => {
    console.log("new album added!!")
    // try {
    //   await axios.post(API_URL, {
    //     name: newTask,
    //     completed: false,
    //   });

    //   await fetchTasks();

    //   setNewTask("");
    // } catch (err) {
    //   console.log(err);
    // }
  };

  return (
    <div>
      <Typography align="center" variant="h2" paddingTop={2} paddingBottom={2}>
        My Album List
      </Typography>

      <div className="addAlbumForm">
        <TextField
          size="small"
          label="Album Name"
          variant="standard"
          //align="center"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <Button
          disabled={!newTask.length}
          variant="outlined"
          onClick={addNewTask}
        >
          <AddIcon />
        </Button>
      </div>
    </div>
  );
};
