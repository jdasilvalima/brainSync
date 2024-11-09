# BRAIN SYNC

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Llama3.2](https://img.shields.io/badge/Llama3.2-000000?style=for-the-badge&logo=ollama&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/jdasilvalima/brainSync?style=for-the-badge)
[![GitHub last commit](https://img.shields.io/github/last-commit/jdasilvalima/brainSync?style=for-the-badge)](https://github.com/jdasilvalima/brainSync/commits)

## I. PROJECT DESCRIPTION
### I.1 Introduction
**BrainSync** is a web application designed to enhance the study experience by providing **AI-generated** personalized learning paths, flashcards, and quizzes. Based on the principles of **spaced repetition**, the platform optimizes memory retention by revisiting information at strategically timed intervals.

**Features :**

- **Personalized Learning Paths:** AI generates tailored study paths based on user goals and progress, ensuring an effective learning journey.
- **Flashcards:** AI-created flashcards allow users to practice active recall, with options to manage and review them for better retention.
- **Adaptive Quizzes:** AI-driven quizzes adapt to individual needs, reinforcing areas that require improvement.

### I.2 Goals
This project is designed as a personal learning initiative with the following goals:

- Deepen knowledge in Artificial Intelligence
- Learn frontend development with React
- Explore backend development using Python and Flask

### I.3 Web Application Overview
WIP

## II. PROJECT SETUP
### II.1 Requirements
- [Docker](https://www.docker.com/) neeeds to be installed
- [Node.js](https://nodejs.org/en) and a package manager like 'npm'
- Optional - [Bruno](https://www.usebruno.com/) can utilize the API collection located in the 'api_collection' folder to make HTTP/HTTPS requests to the backend

Clone this project
  ```sh
  git clone git@github.com:jdasilvalima/brainSync.git
  cd brainSync
  ```

### II.2 BACKEND
This project is using Flask + Python + PostgreSQL.
There is an Ollama server using Llama3.2 model.

Create and set-up .env file :
```sh
cd .\backend\

touch .env

# PostgreSQL
POSTGRES_USER=postgres_user
POSTGRES_PASSWORD=postgres_password
POSTGRES_DB=brainsync

# Flask
FLASK_ENV=development
DATABASE_URL=postgresql://postgres_user:postgres_password@flask_db:5432/brainsync
```

Build and run locally :
```sh
cd brainSync
docker-compose up --build
```

![Backend Docker Containers](./readme-doc/backend-containers.png)

### II.3 FRONTEND
This project is using React + TypeScript + Vite.

To run locally :
```sh
cd .\frontend\
npm install
npm run dev
```

## III. APPLICATION ARCHITECTURE
### III.1 Database
![Tables](./readme-doc/tables.png)

### III.2 Backend
WIP

### III.1 Frontend
WIP
![Frontend topic / flashcards presentation](./readme-doc/frontend-flashcards-topic.png)
![Flashcards presentation](./readme-doc/frontend-flashcards.png)

## IV. REFERENCES
**Spaced Repetition Learning**
- [How to Remember Anything](https://rachel.fast.ai/posts/2023-02-21-anki/)