from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import questionario, ecossistema

# Cria as tabelas no banco de dados SQLite automaticamente
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Backend POC Suzano - Incentiv")

# Configuração de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclusão dos Routers
app.include_router(ecossistema.router)
app.include_router(questionario.router)