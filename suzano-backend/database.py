import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

load_dotenv()

# === 1. CONEXÃO EXTERNA (Banco da Incentiv para leitura) ===
def get_db_incentiv():
    user = os.getenv("DB_USER")
    passwd = os.getenv("DB_PASSWD")
    host = os.getenv("DB_HOST")
    port = os.getenv("DB_PORT", "5432")
    db_name = os.getenv("DB_NAME", "incentiv-partners") # Ou a base onde ficam os projetos
    
    conn_str = f"postgresql+psycopg2://{user}:{passwd}@{host}:{port}/{db_name}"
    return create_engine(conn_str)

engine_incentiv = get_db_incentiv()

# Para a POC rodar agora, usamos SQLite local. 
# Para PostgreSQL mude para: "postgresql://usuario:senha@localhost/incentiv_db"
SQLALCHEMY_DATABASE_URL = "sqlite:///./suzano_poc.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    connect_args={"check_same_thread": False} # Necessário apenas para SQLite
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependência para injetar a sessão do banco nas rotas
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()