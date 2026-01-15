from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Environment
    ENVIRONMENT: str = "development"
    
    # Database
    DATABASE_URL: str
    
    # OpenAI
    OPENAI_API_KEY: str
    OPENAI_MODEL: str = "gpt-4-turbo-preview"
    EMBEDDING_MODEL: str = "text-embedding-3-small"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379"
    
    # AI Configuration
    CONFIDENCE_THRESHOLD: float = 0.8
    MAX_CONTEXT_LENGTH: int = 4000
    TEMPERATURE: float = 0.7
    TOP_K_FAQS: int = 5
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
