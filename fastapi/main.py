from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.routers import router as agent_router
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(agent_router)