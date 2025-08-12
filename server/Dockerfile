FROM ubuntu:22.04 AS builder

RUN apt-get update && apt-get install -y \
    g++ \
    make

WORKDIR /app
COPY ./src/ ./src/
WORKDIR /app/src

RUN make

FROM python:3.10-slim

WORKDIR /app

# Borrar esto en caso de error 
COPY game_manager.py .
COPY router.py .
COPY main.py .
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
# Borrar en caso de error

COPY --from=builder /app/src/engine ./src/engine

RUN chmod +x ./src/engine

# Borrar en caso de error
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
# Borrar en caso de error