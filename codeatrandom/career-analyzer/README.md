npm run dev
node server.js
Project Overview

then pass your gemini api key
![Video](https://drive.google.com/file/d/18X9-oOgxG_Eq1-j5r7yDJ1FVmbXirCLv/view?usp=sharing)
![Career Goal Input Page](https://github.com/user-attachments/assets/44edaba5-d7b6-4b8c-a014-96a6407952ae)

![home](https://github.com/user-attachments/assets/ea2d5c16-1c19-4500-afff-267090706d5d)

sorry i wasnt able to deploy cause i have end sem papers
This is an intern-level project built to demonstrate backend API design + a lightweight frontend flow.
It provides:

A Skill Gap Analyzer API (POST /api/skill-gap) that compares user skills to role expectations and returns matched/missing skills, recommendations, and a suggested learning order.

A Career Roadmap Generator API (POST /api/roadmap) that returns a 3-phase mock AI-style roadmap for the target role.

A HackerNews fetcher (public integration) that returns the top 5 latest tech stories (title, url, score, time, type, by).

A simple frontend that posts user input and shows results (not required to be complex).

This repository was created as an intern project at CodeAtRandom.

Features

Career Goal Input Page (simple): target role, current skills, analyze button.

POST /api/skill-gap — server-side skill gap analysis (uses predefined JSON).

POST /api/roadmap — returns a 3-level career roadmap (mock AI logic).

GET /api/hackernews/top-tech — fetches top 5 latest tech stories from HackerNews.

Clear sample responses and usage examples for testing.
