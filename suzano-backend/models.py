from sqlalchemy import Column, Integer, String, JSON, DateTime
from datetime import datetime
from database import Base

class RespostaQuestionarioDB(Base):
    __tablename__ = "respostas_suzano"

    id = Column(Integer, primary_key=True, index=True)
    projeto_id = Column(String, unique=True, index=True) # unique=True já garante bloqueio no banco [cite: 46]
    nome_projeto = Column(String)
    proponente = Column(String)
    lei_incentivo = Column(String)
    respostas_brutas = Column(JSON) # Salva o payload completo para detalhamento [cite: 151, 152]
    pontuacao_final = Column(Integer)
    data_envio = Column(DateTime, default=datetime.utcnow)