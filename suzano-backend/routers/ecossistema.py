from fastapi import APIRouter
from sqlalchemy import text
from database import engine_incentiv

router = APIRouter(prefix="/ecossistema", tags=["Ecossistema Incentiv"])

@router.get("/{projeto_id}")
def buscar_dados_projeto(projeto_id: str):
    """
    Recebe o UUID do projeto e faz JOIN com as tabelas de leis e proponentes
    para buscar os nomes reais.
    """
    
    # Utilizamos LEFT JOIN por segurança, caso algum projeto antigo 
    # esteja sem lei vinculada, a query não quebra.
    query = """
        SELECT 
            p."name" AS projeto_nome, 
            a."name" AS proponente_nome, 
            l."name" AS lei_nome
        FROM 
            "projects" p
        LEFT JOIN 
            "accounts:proponent" a ON p."proponentId" = a."id"
        LEFT JOIN 
            "queries:law" l ON p."lawId" = l."id"
        WHERE 
            p."id" = :id 
        LIMIT 1
    """
    
    try:
        with engine_incentiv.connect() as conn:
            # O parâmetro :id previne SQL Injection e passa o UUID seguro
            result = conn.execute(text(query), {"id": projeto_id}).fetchone()
            
            if result:
                return {
                    "nome": result[0],       # Mapeia p."name"
                    "proponente": result[1], # Mapeia a."name"
                    "lei": result[2]         # Mapeia l."name"
                }
            
            return None
            
    except Exception as e:
        print(f"❌ Erro ao buscar projeto no ecossistema: {e}")
        return None
