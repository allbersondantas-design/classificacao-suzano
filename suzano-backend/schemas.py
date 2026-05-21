from pydantic import BaseModel
from typing import List, Optional

class RespostaQuestionario(BaseModel):
    link_projeto: str
    exposicao_marca: str
    materiais_marca: Optional[List[str]] = []
    outro_material: Optional[str] = None
    abrangencia: List[str]
    visibilidade: List[str]
    voluntariado: str
    dinamica_voluntariado: Optional[str] = None

class RankingResponse(BaseModel):
    posicao: str
    projeto: str
    proponente: str
    lei: str
    pontuacao_final: int
    detalhes: dict