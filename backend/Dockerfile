# Etapa 1: Configurar a aplicação Flask
FROM python:3.8-slim

# Definir o diretório de trabalho
WORKDIR /backend

# Copiar o arquivo requirements.txt para o diretório de trabalho
COPY ./requirements.txt .

# Instalar as dependências do Python
RUN pip install --no-cache-dir -r requirements.txt

# Copiar o restante dos arquivos da aplicação Flask para o diretório de trabalho
COPY . /backend

# Expor a porta da aplicação
EXPOSE 5000

# Comando para iniciar a aplicação
CMD ["python", "src/app.py"]
