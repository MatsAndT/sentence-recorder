# Sentence Recorder

This is a tool to collect read audio given sentences to record.

Json files that contain the sentences should be placed at `backend/data/json/{task_id}.json` with the following format:

```json
[
    {
        "sentenceId": "sample1_sentence1",
        "sentence": "This is sample sentence 1 from sample1.json."
    },
    {
        "sentenceId": "sample1_sentence2",
        "sentence": "This is sample sentence 2 from sample1.json."
    }
]
```

Users can access the web app at `{frontend_url}/task/{task_id}` (e.g., http://localhost:5173/task/sample1), where they can record the audio sentence by sentence, check the audio, and submit the audio of their choosing.

The submitted audio will be saved as `backend/data/audio/{task_id}/{sentenceId}.webm` in the [Opus](https://opus-codec.org/) format.

## Deployment

This repo is set up to run via Docker Compose, driven by the root `.env` file.

### 1) Configure environment

Edit `.env` at the repo root:

```dotenv
FRONTEND_PORT=7770
BACKEND_PORT=7777

# Where the browser will load the frontend from
FRONTEND_URL=http://localhost:7770

# Where the browser will reach the backend API
BACKEND_URL=http://localhost:7777

# Optional: if you need multiple allowed origins for CORS, use a comma-separated list.
# If set, this takes precedence over FRONTEND_URL.
# CORS_ORIGINS=https://example.com,http://localhost:7770
```

Notes:

- Docker maps `FRONTEND_PORT -> 5173` (frontend container) and `BACKEND_PORT -> 8000` (backend container).
- The backend CORS config is sourced from `CORS_ORIGINS` or `FRONTEND_URL`.
- The frontend API base URL is sourced from `BACKEND_URL`.

### 2) Start with Docker Compose

From the repo root:

```bash
docker compose up --build
```

Then open:

- Frontend: `http://localhost:${FRONTEND_PORT}`
- Backend: `http://localhost:${BACKEND_PORT}`

### 3) Add sentence tasks

Place sentence JSON files in:

- `backend/data/json/{task_id}.json`

The frontend will list tasks from the backend at `/tasks`.

### Production notes

- If you deploy behind a reverse proxy (recommended), set `FRONTEND_URL` and `BACKEND_URL` to their public HTTPS URLs and expose only the proxy to the internet.
- If your frontend is served on multiple domains (or you want both prod + localhost), set `CORS_ORIGINS` to a comma-separated list.

Important: the current frontend container runs Vite's dev server (`bun run dev`). This is fine for internal deployments and testing, but for a typical production setup you would build static assets and serve them via a production web server.
