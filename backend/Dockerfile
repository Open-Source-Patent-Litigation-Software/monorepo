# syntax=docker/dockerfile:1

FROM --platform=linux/amd64 python:3.11-slim-buster as build

WORKDIR /app/backend

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8080

CMD ["python3", "run.py"]
