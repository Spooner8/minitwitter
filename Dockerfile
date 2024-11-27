FROM oven/bun:latest

WORKDIR /app

COPY . /app/

RUN bun install

CMD [ "bun", "src/app.ts"]