FROM python:3.14-alpine

ENV PORT=8000
EXPOSE $PORT

COPY . /app
WORKDIR /app

RUN adduser -D -H containeruser

USER containeruser

ENTRYPOINT python -m http.server $PORT
