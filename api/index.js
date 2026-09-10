import express from "express";
import serverless from "serverless-http";
import cors from "cors";
import {
  fetchAlbums,
  fetchList,
  createAlbums,
  updateAlbums,
  deleteAlbums,
  createUser,
  getUser,
  parseAlbumQuery,
  queryAlbumsNL,
} from "./task.js";
import { OAuth2Client } from "google-auth-library";

const app = express();
const port = 3001;
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.use(express.json());

if (process.env.DEVELOPMENT) {
  app.use(cors());
}

// Verifies the Google ID token on every protected request. The user's identity comes
// from the signed token payload, never from the request body or URL, so a caller can
// only ever act on their own data.
const requireAuth = async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Missing authentication token" });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    req.user = {
      userId: payload.sub,
      email: payload.email,
      name: payload.name,
    };
    next();
  } catch (err) {
    // Also covers the ~1 hour expiry of Google ID tokens; the client re-authenticates.
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

// A write blocked by a DynamoDB ConditionExpression means the album exists but is not
// the caller's, or does not exist at all. Both are reported the same way so the API
// does not leak which albums exist.
const isOwnershipFailure = (err) =>
  err.name === "ConditionalCheckFailedException";

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/discogs/search", requireAuth, async (req, res) => {
  try {
    const { q } = req.query;
    const response = await fetch(
      `https://api.discogs.com/database/search?q=${encodeURIComponent(q)}&type=master&token=${process.env.DISCOGS_TOKEN}`,
    );
    const data = await response.json();
    res.send(data);
  } catch (err) {
    res.status(400).send(`Error searching Discogs: ${err}`);
  }
});

// Albums the signed-in user has listened to.
app.get("/album", requireAuth, async (req, res) => {
  try {
    const albums = await fetchList(req.user.userId);
    res.send(albums.Items);
  } catch (err) {
    res.status(400).send(`Error fetching Users Albums: ${err}`);
  }
});

// Albums on the signed-in user's listen list.
app.get("/listen", requireAuth, async (req, res) => {
  try {
    const list = await fetchAlbums(req.user.userId);
    res.send(list.Items);
  } catch (err) {
    res.status(400).send(`Error fetching List: ${err}`);
  }
});

app.post("/query", requireAuth, async (req, res) => {
  try {
    const { question } = req.body;
    if (!question || typeof question !== "string" || !question.trim()) {
      return res.status(400).json({ error: "Missing question" });
    }

    const filters = await parseAlbumQuery(question.trim());
    const results = await queryAlbumsNL(req.user.userId, filters);

    res.send(results.Items);
  } catch (err) {
    res.status(400).send(`Error running query: ${err}`);
  }
});

app.post("/album", requireAuth, async (req, res) => {
  try {
    const { name, listened, image } = req.body;
    const response = await createAlbums({
      name,
      listened,
      image,
      userId: req.user.userId,
    });
    res.send(response);
  } catch (err) {
    res.status(400).send(`Error creating album: ${err}`);
  }
});

app.put("/album", requireAuth, async (req, res) => {
  try {
    const { id, name, listened } = req.body;
    const response = await updateAlbums({
      id,
      name,
      listened,
      userId: req.user.userId,
    });
    res.send(response);
  } catch (err) {
    if (isOwnershipFailure(err)) {
      return res.status(404).json({ error: "Album not found" });
    }
    res.status(400).send(`Error updating album: ${err}`);
  }
});

app.delete("/album/:id", requireAuth, async (req, res) => {
  try {
    const id = req.params.id;
    const response = await deleteAlbums(id, req.user.userId);
    res.send(response);
  } catch (err) {
    if (isOwnershipFailure(err)) {
      return res.status(404).json({ error: "Album not found" });
    }
    res.status(400).send(`Error deleting album: ${err}`);
  }
});

// The only public endpoint. Verifies the Google ID token and creates the user record
// on first sign-in, so account creation cannot be driven by an unauthenticated caller.
app.post("/auth/google", async (req, res) => {
  const { token } = req.body;

  let userId, email, name;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    userId = payload.sub;
    email = payload.email;
    name = payload.name;
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }

  try {
    const existing = await getUser({ id: userId });

    if (existing.Items === undefined || existing.Items.length === 0) {
      await createUser({ clientId: userId, email, name });
    }

    res
      .status(200)
      .json({ message: "Login successful", user: { userId, email, name } });
  } catch (err) {
    res.status(500).json({ error: `Error signing in: ${err}` });
  }
});

if (process.env.DEVELOPMENT) {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}

export const handler = serverless(app);
