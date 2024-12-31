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

- Deepen knowledge in Artificial Intelligence, with a particular focus on developing localized solutions
- Learn frontend development with React
- Explore backend development using Python and Flask

### I.3 Web Application Overview
<p align="center">
  <img src="./readme-doc/web-app-presentation.gif" alt="Web Application Presentation Gif" style="width: 50%;">
</p>



## II. PROJECT SETUP
### II.1 Requirements
- [Docker](https://www.docker.com/) neeeds to be installed
- Optional - [Bruno](https://www.usebruno.com/) can utilize the API collection located in the 'api_collection' folder to make HTTP/HTTPS requests to the backend

Clone this project
  ```sh
    mkdir brainSync
    git clone git@github.com:jdasilvalima/brainSync.git
  ```

### II.2 BACKEND
This project is using Flask + Python + PostgreSQL.
There is an Ollama server using Llama3.2 model.

Create and set-up .env file in the backend folder :

```bash
  cd .\backend\
```
```bash
  echo # PostgreSQL > .env2
  echo POSTGRES_USER=postgres_user >> .env2
  echo POSTGRES_PASSWORD=postgres_password >> .env2
  echo POSTGRES_DB=brainsync >> .env2
  echo. >> .env2
  echo # Flask >> .env2
  echo FLASK_ENV=development >> .env2
  echo DATABASE_URL=postgresql://postgres_user:postgres_password@flask_db:5432/brainsync >> .env2
```

Build and run locally :
```bash
  cd brainSync
  docker-compose up --build
```

![Backend Docker Containers](./readme-doc/backend-containers.png)

### II.3 FRONTEND
This project is using React + TypeScript + Vite.

The front-end container will be build with the previous command 'docker-compose up --build'.

![FrontEnd Docker Containers](./readme-doc/frontend-containers.png)

## III. APPLICATION ARCHITECTURE
### III.1 Database
Below is a schema illustrating the structure and relationships between the database tables.
<p align="center">
  <img src="./readme-doc/tables.png" alt="Tables">
</p>

### III.2 Backend
The backend is structured as a modular Python application organized into distinct functional areas:

![Backend Core Module](./readme-doc/core-modules.png)

We are using a **Model-Controller-Service arhictecture**. Each module follows a three-layer architecture with controllers (handling HTTP requests), services (implementing business logic), and models (managing data).

![Backend Architecture](./readme-doc/be-architecture.png)

### III.1 Frontend
The following schema illustrates how the pages in the application are interconnected, highlighting the navigation flow and their hierarchical relationships.
![FrontEnd Architecture](./readme-doc/fe-architecture.png)


## IV. REFERENCES
**Local LLMs**
- [Everything I've learned so far about running local LLMs (EN)](https://nullprogram.com/blog/2024/11/10/)

**Spaced Repetition Learning**
- [How to Remember Anything (EN)](https://rachel.fast.ai/posts/2023-02-21-anki/)