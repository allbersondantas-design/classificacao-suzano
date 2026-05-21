from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
import re
from schemas import RespostaQuestionario
from models import RespostaQuestionarioDB
from database import get_db
from routers.ecossistema import buscar_dados_projeto

router = APIRouter(tags=["Questionário"])

def calcular_pontuacao(dados: RespostaQuestionario) -> int:
    score = 0
    
    if dados.exposicao_marca == "Sim":
        score += 17 # [cite: 65]
        
    pesos_multiplos = {
        "Abrangência Municipal": 12, # [cite: 92, 111]
        "Abrangência Estadual": 7,   # [cite: 94, 113]
        "Abrangência Nacional": 5    # [cite: 96, 115]
    }
    
    score += sum(pesos_multiplos.get(a, 0) for a in dados.abrangencia)
    score += sum(pesos_multiplos.get(v, 0) for v in dados.visibilidade)
        
    if dados.voluntariado == "Sim":
        score += 10 # [cite: 124]
        
    return score

@router.post("/submit")
async def receber_resposta(dados: RespostaQuestionario, db: Session = Depends(get_db)):
    # 1. Identificar ID [cite: 9, 10]
    match = re.search(r'/projects/([a-f0-9\-]{36})', dados.link_projeto, re.IGNORECASE)
    if not match:
        raise HTTPException(status_code=400, detail="Não conseguimos identificar o projeto a partir do link informado. Revise o link do projeto cadastrado na Incentiv e tente novamente. [cite: 48, 49]")
    
    projeto_id = match.group(1)
    
    # 2. Consultar Ecossistema [cite: 42, 43]
    projeto_info = buscar_dados_projeto(projeto_id)
    if not projeto_info:
        raise HTTPException(status_code=404, detail="Projeto não encontrado.")
    
    # 3. Validação de Resposta Duplicada direto no banco [cite: 46]
    resposta_existente = db.query(RespostaQuestionarioDB).filter(RespostaQuestionarioDB.projeto_id == projeto_id).first()
    if resposta_existente:
        raise HTTPException(status_code=403, detail="Já existe uma resposta registrada para este projeto. Para esta etapa, não é permitido reenviar ou editar o questionário. [cite: 51, 52]")
    
    # 4. Cálculo e Persistência [cite: 12, 133]
    pontuacao = calcular_pontuacao(dados)
    
    nova_resposta = RespostaQuestionarioDB(
        projeto_id=projeto_id,
        nome_projeto=projeto_info["nome"],
        proponente=projeto_info["proponente"],
        lei_incentivo=projeto_info["lei"],
        respostas_brutas=dados.dict(),
        pontuacao_final=pontuacao
    )
    
    db.add(nova_resposta)
    db.commit()
    db.refresh(nova_resposta)
    
    return {"mensagem": "Sucesso", "projeto": projeto_info["nome"], "pontuacao": pontuacao}

@router.get("/ranking")
async def obter_ranking(db: Session = Depends(get_db)):
    # Consulta já ordenada pelo banco de dados
    respostas = db.query(RespostaQuestionarioDB).order_by(RespostaQuestionarioDB.pontuacao_final.desc()).all()
    
    resultado = []
    posicao_atual = 1
    
    for i, item in enumerate(respostas):
        # Lógica de empate [cite: 21, 147]
        if i > 0 and item.pontuacao_final < respostas[i-1].pontuacao_final:
            posicao_atual = i + 1
            
        resultado.append({
            "posicao": f"{posicao_atual}º",
            "projeto": item.nome_projeto,
            "proponente": item.proponente,
            "lei": item.lei_incentivo,
            "pontuacao_final": item.pontuacao_final,
            "detalhes": item.respostas_brutas
        })
        
    return resultado