import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.regional import router as regional_router


load_dotenv()


def _cors_origins() -> list[str]:
    configured = os.getenv("CORS_ORIGINS")
    if configured:
        return [
            origin.strip().rstrip("/")
            for origin in configured.split(",")
            if origin.strip()
        ]
    return [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ]


app = FastAPI(
    title="Lipi Lens Regional Kannada Intelligence",
    description="Rule-based Kannada regional evidence analysis.",
    version="1.0.0",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_origins(),
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type"],
)
app.include_router(regional_router)


@app.get("/health", tags=["health"])
def health_check() -> dict[str, str]:
    return {"status": "ok"}