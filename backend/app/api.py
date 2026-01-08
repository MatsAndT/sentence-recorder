from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import json
from pathlib import Path
from pydantic import BaseModel
import base64
import os


app = FastAPI()

def _parse_origins(value: str) -> list[str]:
    parts = [p.strip() for p in value.split(",")]
    return [p for p in parts if p]


origins: list[str]

cors_env = os.getenv("CORS_ORIGINS")
frontend_url_env = os.getenv("FRONTEND_URL")

if cors_env:
    origins = _parse_origins(cors_env)
elif frontend_url_env:
    origins = [frontend_url_env.strip()]
else:
    with open("app/config.json") as f:
        origins = json.load(f)["origins"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["root"])
async def read_root() -> dict:
    return {"message": "connected to backend"}

@app.get("/tasks")
def list_tasks():
    tasks_dir = Path("data/json")
    task_files = tasks_dir.glob("*.json")
    task_ids = [file.stem for file in task_files]
    return JSONResponse(task_ids)

@app.get("/read-json/{task_id}")
def read_json(task_id: str):
    json_dir = Path("data/json")
    try:
        json_file = json_dir / f"{task_id}.json"
        with open(json_file, "r", encoding="utf-8") as f:
            content = json.load(f)

        return JSONResponse(content)

    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=400, detail=f"Invalid JSON format: {task_id}.json."
        )


class Recording(BaseModel):
    sentenceId: str
    audioUrl: str


@app.post("/submit-recordings/{task_id}")
async def submit_recordings(recordings: list[Recording], task_id: str, name: str):
    audio_dir = Path(f"data/audio/{task_id}/{name}")
    audio_dir.mkdir(parents=True, exist_ok=True)

    if not recordings:
        raise HTTPException(status_code=400, detail="No recordings provided.")

    try:
        for recording in recordings:
            with open(audio_dir / f"{recording.sentenceId}.webm", "wb") as f:
                f.write(base64.b64decode(recording.audioUrl.split(",")[1]))
        return {"message": "Recordings submitted successfully."}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Submission failed: {str(e)}")
