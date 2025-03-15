# Minitwitter

This is a small demoproject as a Full-Stack application.

What you get:
- Backend: Express.js
- Database: PostgreSQL
- Frontend: Nuxt.js / Vue.js
- Caching: Redis
- AI-Features: Ollama model for sentiment analyzis
- AI-Processing: IORedis / Bullmq
- Security: Simple Authentication and Express-Rate-Limiter
- Logging: Pino / Pino-Http
- Performance: K6 load- and stresstests
- Analysis: Prometheus and Grafana
- Loadbalancing: nginx (Starting with 2 instances of api)

## Quick start

Before you run the Container-Stack, you have to set the environment variables.
Add the files described below or rename existing example files (same content) and just remove the ***.example*** at the end.

Files in the repository:
- api.env.example
- db.env.example
- app.env.example
- worker.env.example

## Recommended way
### db.env
```dotenv
POSTGRES_USER='postgres'
POSTGRES_PASSWORD='supersecret123'
POSTGRES_DB='minitwitter'
```

### api.env
```dotenv
DATABASE_URL='postgressql://postgres:supersecret123@db:5432/minitwitter' # Or what ever you set in db.env
OLLAMA_BASE_URL='http://ollama-1:11434'
OLLAMA_MODEL='llama3.2:1b' # Optional -> Default = 'llama3.2:1b'
REDIS_HOST='redis'
SERVER_ROLE='api'
CACHE_ACTIVE='true' # Optional -> Default = true
RATE_LIMITER='true' # Optional -> Default = true
LOG_LEVEL='info' # Optional -> Default = 'info'
```

### worker.env
```dotenv
SERVER_ROLE='worker'
RATE_LIMITER='false' # Optional -> Default = true
LOG_LEVEL='error' # Optional -> Default = 'info'
```

### app.env
```dotenv
NUXT_PUBLIC_API_BASE_URL='http://localhost:80'
```

## Optional way
You can set the variables directly in the **docker-compose.yml** - File. If you prefere this way, set the variables mentioned above into the services with the same name as the filenames above.

## First Startup
If your docker daemon isn't allready running, start it.
Now you can run your container-stack. Enter the following command in your terminal on root directory.
```bash
docker compose up -d --build
```
This will take a few minutes to build and start all services for you.

***Do not run the stack without build flag, because the published version on docker hub may not be at the same version of your actual code!***

### Init the database tables
For the first time you run up the Stack, you have to go into one of the **api**-Container terminals an run
```bash
bunx drizzle-kit push
```
You can exec the terminal via ***Docker Desktop*** or just run 
```bash
docker exec -it api-1 sh
```
in a terminal in your IDE to join the container shell.

After initializing the Tables, leave the shell with
```bash
exit
```

## Use the App

At this point you can switch to your browser and enter 'http://localhost' as url in order to join your own minitwitter.

# For Developers
### Backend - First steps

1. **Install Environment**

    First of all, if you haven't installed Node and Bun on your system, follow the installation guid here:

    - https://nodejs.org/en
    - https://bun.sh/docs/installation

    After that, restart your IDE to enable the commands in your terminal.

2. **Setup environment variables for running locally (development)**

    Create a file in the root directory named **.env** or rename existing file .env.example

    You need to set the following variables in it:

    ```dotenv
    DATABASE_URL='postgressql://postgres:supersecret123@db:5432/minitwitter'
    JWT_SECRET='thisisreallysecret'
    OLLAMA_MODEL='llama3.2:1b' # (or some bigger one, if you want)
    SERVER_ROLE='all' # Optional -> Default = 'all'
    RATE_LIMITER='true' # Optional -> Default = true
    LOG_LEVEL='info' # Optional -> Default = 'info'
    ```

3. **Install dependencies**

    ```bash
    bun install
    ```

4. **To use the backend in developmend-mode, you need some running services first**

    So we recommend to start the Docker-Stack from the Quick-Start area first.
    If you want to work without running a docker stack you need to prepare the services yourself.

    - PostgreSQL Database (think about the credentials in the .env file)
    - Redis cache database (or disable it with env-variable: CACHE_ACTIVE=false)
    - Running Ollama Model 
        - https://ollama.com/download
        - https://ollama.com/library/llama3.2:1b

    Then you can run the backend with:
    ```bash
    bun dev
    ```

    Apply database models (Database has to be running)
    ```bash
    bunx drizzle-kit push
    ```
    To check if the database contains the correct tables, just enter
    ```bash
    bunx drizzle-kit studio
    ```
    in the terminal an go to https://local.drizzle.studio to check or check your PostgreSQL database with *Azure Data Studio* or some tool you prefer.

    You can now reach the backend endpoints with a tool like *Postman* or what ever you prefer for handle http-requests without a frontend.

    If you want testing with a frontend, you can now change to the directory /frontend
    ```bash
    cd ./frontend/
    ```

    Again install the dependencies.
     ```bash
    bun install
    ```

    After that you are ready to start the frontend with:
    ```bash
    bun dev
    ```
    
    The frontend is now aviable on http://localhost:4000 and it will use your running database and all other services from the docker-stack exculding the backend.
    Your able to develop on front- and backend with live reload.