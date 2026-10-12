# Inkline Article API

Express and TypeScript backend for the Inkline article application.

## Features

- JWT-based registration, login, refresh, and authenticated user access
- MongoDB persistence with Mongoose
- Authenticated article creation and listing
- Full article detail endpoint
- Multipart image uploads with Multer
- Local uploaded-image serving from `/uploads`
- Image-only uploads with a 5 MB size limit

## Requirements

- Node.js 20 or newer
- MongoDB

## Setup

Install dependencies:

```bash
npm install
```

Create a `.env` file using `.example.env`:

```env
MONGO_LOCAL_URL=mongodb://127.0.0.1:27017/inkline
PORT=3000
JWT_SECRET=replace-with-a-long-random-secret
```

## Run

Development mode:

```bash
npm run dev
```

Build and run the compiled server:

```bash
npm run build
npm start
```

The API runs at `http://localhost:3000` by default.

## API routes

Authentication routes are available under `/api/v1/auth`.

| Method | Endpoint | Description | Authentication |
| --- | --- | --- | --- |
| `POST` | `/api/v1/auth/register` | Register a user | No |
| `POST` | `/api/v1/auth/login` | Log in | No |
| `POST` | `/api/v1/auth/refresh` | Refresh an access token | No |
| `GET` | `/api/v1/auth/me` | Get the current user | Bearer token |
| `POST` | `/api/v1/article/create` | Create an article | Bearer token |
| `GET` | `/api/v1/article/` | List articles | Bearer token |
| `GET` | `/api/v1/article/:id` | Read one article | Bearer token |

## Creating an article

Send a `multipart/form-data` request to `/api/v1/article/create`.

Required fields:

- `title`
- `content`
- `author`

Optional fields:

- `tags` as a comma-separated string
- `imageURL` as an image file

Uploaded images are stored in `uploads/` and returned as URLs such as:

```text
/uploads/filename.jpg
```

Do not send the image as Base64. The frontend should use `FormData` and allow Axios to set the multipart boundary automatically.

## Validation

```bash
npm run typecheck
npm test
npm run build
```

## Project structure

```text
src/
├── controllers/   Request handlers
├── middleware/    Authentication middleware
├── models/        Mongoose schemas
├── routes/        Express routes
└── index.ts       Application entry point
uploads/           Local uploaded images
```

Never commit `.env` or uploaded user files.
