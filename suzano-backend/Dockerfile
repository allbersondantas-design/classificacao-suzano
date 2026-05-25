# Usa uma versão leve do Python
FROM python:3.12-slim

# Define a pasta de trabalho dentro do container
WORKDIR /app

# Copia o arquivo de dependências e instala tudo
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia todo o resto do código da sua pasta backend para o container
COPY . .

# Libera a porta 8080 (que é o padrão de rede do Google Cloud Run)
EXPOSE 8080

# oda o Uvicorn apontando para 0.0.0.0
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]