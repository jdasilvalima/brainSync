# BRAIN SYNC

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Llama3.2](https://img.shields.io/badge/Llama3.2-000000?style=for-the-badge&logo=ollama&logoColor=white)

![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/jdasilvalima/brainSync?style=for-the-badge)
[![GitHub last commit](https://img.shields.io/github/last-commit/jdasilvalima/brainSync?style=for-the-badge)](https://github.com/jdasilvalima/brainSync/commits)

## I. PROJECT DESCRIPTION
### I.1 Introduction
**BrainSync** - is a web application designed to enhance the studying experience by creating personalized learning paths, flashcards, and quizzes. The platform is built on the principles of **spaced repetition**, a scientifically-proven learning technique that optimizes memory retention by reviewing information at strategically timed intervals.

**Features :**

- **Personalized Learning Paths:** Users can generate customized learning paths tailored to their goals and progress.
- **Flashcards:** Create, manage, and review flashcards for active recall practice.
- **Quizzes:** Take adaptive quizzes that adjust based on performance, helping reinforce weaker areas.

BrainSync's goal is to make studying more efficient and effective, promoting long-term knowledge retention for students and lifelong learners.


### I.2 Requirements
- [Docker](https://www.docker.com/) neeeds to be installed
- [Node.js](https://nodejs.org/en) and a package manager like 'npm'
- Optional - [Bruno](https://www.usebruno.com/) can utilize the API collection located in the api folder to make HTTP/HTTPS requests to the backend
- Clone this project
  ```sh
  git clone git@github.com:jdasilvalima/brainSync.git
  cd brainSync
  ```

## II. BACKEND

Build and run locally :
```sh
docker-compose up --build
```

![Backend Docker Containers](./readme-doc/backend-containers.png)

## III. FRONTEND
This project is using React + TypeScript + Vite
To run locally :
```sh
cd .\frontend\
npm install
npm run dev
```

![Frontend topic / flashcards presentation](./readme-doc/frontend-flashcards-topic.png)
![Flashcards presentation](./readme-doc/frontend-flashcards.png)