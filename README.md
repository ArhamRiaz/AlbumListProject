# Album Tracker

[album-tracker.com](https://album-tracker.com) — a web app for keeping track of albums you want to listen to and albums you've already heard.

Search the [Discogs](https://www.discogs.com/) database, add records to your list, and move them across once you've listened. Sign-in is handled through Google.

## Features

- **Google sign-in** — no passwords; ID tokens are verified server-side
- **Album search** — powered by the Discogs master release database
- **Two lists** — "Listened" and "Listen List", with one-click toggling between them
- **Per-user libraries** — albums are scoped to the signed-in account

## Tech stack

| Layer        | Technology                                                       |
| ------------ | ---------------------------------------------------------------- |
| Frontend     | React 19, Material UI 6, React Router 7, Axios, Create React App |
| Backend      | Node.js, Express 4, `serverless-http`                            |
| Database     | AWS DynamoDB                                                     |
| Auth         | Google OAuth (`@react-oauth/google` + `google-auth-library`)     |
| External API | Discogs                                                          |
| Hosting      | Cloudflare (DNS), AWS Amplify (frontend), AWS Lambda (API)       |

The Express app is wrapped by `serverless-http` and exported as a Lambda `handler`, so the same code runs locally as a normal server and in production as a Lambda function.

## Repo layout

```
.
├── api/            Express + Lambda backend
│   ├── index.js    Routes, Google token verification, Lambda handler
│   └── task.js     DynamoDB queries
└── ui/             Create React App frontend
    └── src/
        ├── App.js              Routing, layout, data fetching
        ├── utils.js
        └── components/
            ├── AddAlbum.js         Discogs search
            ├── Album.js            Album card + listened toggle
            ├── SearchAlbum.js      Add album to a list
            ├── UpdateAlbum.js
            ├── ResponsiveAppBar.js
            └── SignupLogin/        Google sign-in / landing page
```

## Getting started

## Data model

**`Albums`** — partition key `id`, with a `listened-id-index` GSI on `listened` used to query each list.

| Attribute  | Type   | Notes                                |
| ---------- | ------ | ------------------------------------ |
| `id`       | string | Primary key                          |
| `name`     | string | Album title                          |
| `listened` | number | `1` = listened, `0` = want to listen |
| `image`    | string | Cover art URL from Discogs           |
| `userId`   | string | Owning user                          |

**`Users`** — partition key `clientId` (the Google account ID), plus `email` and `name`.

## Deployment

- **Frontend** — built with `npm run build` and served through AWS Amplify, with Cloudflare in front for DNS.
- **API** — zipped and uploaded to AWS Lambda, which invokes the exported `handler`.

When redeploying the API, rebuild the upload bundle from a fresh `npm install` rather than reusing an old zip, so dependency updates actually ship.

`app.use(cors())` only runs when `DEVELOPMENT` is set, so in production CORS comes from the Lambda Function URL configuration. If that config lists allowed headers explicitly, `authorization` must be among them or the browser's preflight will block every authenticated request.

## Authentication

Every route except `GET /` and `POST /auth/google` requires a Google ID token:

```
Authorization: Bearer <google-id-token>
```

The API verifies that token on each request and takes the user's identity from the signed payload, so no endpoint accepts a user ID supplied by the caller. Writes are additionally guarded by a DynamoDB condition expression requiring the album to already belong to the caller; a mismatch returns `404` so the API does not reveal whether another user's album exists.

Google ID tokens expire after about an hour. The frontend attaches the token through an Axios interceptor in `ui/src/utils.js` and clears the session on a `401`, sending the user back to sign in.

## Security notes

The Discogs API token in `ui/src/utils.js` is committed to the repository and needs rotating. Because Create React App inlines values into the bundle, moving it to `.env` would not hide it — any token used directly from the browser is public. Proxying Discogs search through the API is the fix that actually keeps it secret.
