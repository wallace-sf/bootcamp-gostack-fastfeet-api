<h1 align="center">
  <img alt="Fastfeet" title="Fastfeet" src="https://user-images.githubusercontent.com/53301430/73714014-4579ea80-46ee-11ea-9c34-da7069b1265c.png" width="300px" />
</h1>

<p align="center">“Simples! É você que controla a sua mente, se você acreditar e lutar pelo que quer, você conseguirá atingir tudo o que pretende.”</blockquote>

<p align="center">
  <img alt="GitHub count languages" src="https://img.shields.io/badge/languages-3-brightgreen" />
  <img alt="Made by Wallace Ferreira" src="https://img.shields.io/badge/made%20by-Wallace%20Ferreira-green" />
  <img alt="Licence by MIT" src="https://img.shields.io/badge/license-MIT-green" />
</p>

## :rocket: Sobre o Bootcamp
O bootcamp da Rocketseat é composto por fases e módulos. Cada módulo é realizado um desafio para fixação do conteúdo apresentado. Para 
ler o desafio completo [clique aqui](https://github.com/Rocketseat/bootcamp-gostack-desafio-03).

## Install
After accessing the project's root folder from the terminal, install the dependencies using: 
```sh
# npm
npm i
# yarn
yarn
```
Create a Docker container with PostgreSQL image:
```sh
docker run --name database -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres
```
Create a Docker container with Redis image:
```sh
docker run --name redisbarber -p 6379:6379 -d -t redis:alpine
```

## Scripts
```sh
# Start in development mode with nodemon
yarn dev or npm run dev
# Start debug in development mode with nodemon
yarn dev:debug or npm run dev:debug
# Start processing queues with Bee Queue
yarn queue or npm run queue
```

