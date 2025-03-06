from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from .api import analysis, datasets

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="AI Portfolio Analysis API",
    description="API for AI-powered portfolio analysis and insights generation",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "1.0.0"}

# Import and include routers
from app.api.routes import auth, token_management

app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(analysis.router, prefix="/api/analysis", tags=["analysis"])
app.include_router(datasets.router, prefix="/api/datasets", tags=["datasets"])
app.include_router(token_management.router, prefix="/tokens", tags=["Token Management"])

@app.get("/")
async def root():
    return {
        "message": "Welcome to the AI Portfolio Analysis API",
        "version": "1.0.0",
        "endpoints": {
            "analysis": "/api/analysis/analyze",
            "token_usage": "/api/analysis/token-usage",
            "datasets": "/api/datasets"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 