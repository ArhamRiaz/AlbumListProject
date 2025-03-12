import express from "express";
import serverless from "serverless-http";
import cors from "cors";
import { fetchAlbums, fetchList, createAlbums, updateAlbums, deleteAlbums } from "./task.js";
import { OAuth2Client } from 'google-auth-library'; 

const app = express();
const port = 3001;
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.use(express.json());

if (process.env.DEVELOPMENT) {
  app.use(cors());
}

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get('/album', async (req, res) => {
  try{
    const albums = await fetchList();
    res.send(albums.Items)
  } catch(err){
    res.status(400).send(`Error fetching Albums: ${err}`)
  }
});

app.get('/listen', async (req, res) => {
  try{
    const list = await fetchAlbums();
    res.send(list.Items)
  } catch(err){
    res.status(400).send(`Error fetching List: ${err}`)
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

        const id= req.params.id;
        console.log("id in index.js: " + id)
        const response = await deleteAlbums(id)
        res.send(response)

      } catch(err){
        res.status(400).send(`Error deleting album: ${err}`)
      }
  });

  app.post('/auth/google', async (req, res) => {
    const { token } = req.body;
    console.log("token" + token);
  
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
  
      const payload = ticket.getPayload();
      const userId = payload.sub; // Google's unique ID for the user
      const email = payload.email;
      const name = payload.name;
  
      // Check if the user exists in your database, or create a new user
      // Example: Save user to database (pseudo-code)
      // const user = await User.findOrCreate({ googleId: userId, email, name });
      //res.send(userId)
      res.status(200).json({ message: 'Login successful', user: { userId, email, name } });
    } catch (err) {
      res.status(400).json({ error: 'Invalid token' });
    }
  });


if (process.env.DEVELOPMENT){
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
});
}


export const handler = serverless(app);