import express from "express";
import serverless from "serverless-http";
import cors from "cors";
import { fetchAlbums, createAlbums, updateAlbums, deleteAlbums } from "./task.js";

const app = express();
const port = 3001;

app.use(express.json());

if (process.env.DEVELOPMENT) {
  app.use(cors());
}

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get('/album', async (req, res) => {
  try{
    const albums = await fetchAlbums();
    res.send(albums.Items)
  } catch(err){
    res.status(400).send(`Error fetching Albums: ${err}`)
  }
});

app.post('/album', async (req, res) => {
    try{

        const albums = req.body;
        const response = await createAlbums(albums)
        res.send(response)

      } catch(err){
        res.status(400).send(`Error creating album: ${err}`)
      }
    });

app.put('/album', async (req, res) => {
    try{

        const albums = req.body;
        const response = await updateAlbums(albums)
        res.send(response)

      } catch(err){
        res.status(400).send(`Error updating album: ${err}`)
      }
});

app.delete('/album/:id', async (req, res) => {
    try{

        const id = req.params;
        const response = await deleteAlbums(id)
        res.send(response)

      } catch(err){
        res.status(400).send(`Error deleting album: ${err}`)
      }
  });


if (process.env.DEVELOPMENT){
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
});
}


export const handler = serverless(app);