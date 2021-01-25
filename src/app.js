const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;

  const repo = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  }

  repositories.push(repo);

  return response.json(repo);
});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const {title, url, techs} = request.body;

  const index = repositories.findIndex(repo => 
    repo.id === id 
  )

  if(index === -1) {
    return response.status(400).json({error: 'This repository does not exists.'})
  }

  const repo = {
    id,
    title,
    url,
    techs,
    likes: repositories[index].likes,
  };

  repositories[index] = repo;

  return response.json(repo);
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;
  
  const index = repositories.findIndex(repo => 
    repo.id === id 
  );

  if (index >= 0) {
    repositories.splice(index, 1);
  } else {
    return response.status(400).json({error: 'This repository does not exist.'})
  }

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;

  const index = repositories.findIndex(repo => 
    repo.id === id 
  );

  if(index === -1) {
    return response.status(400).json({error: 'This repository does not exist.'})
  }

  repositories[index].likes++;

  return response.json(repositories[index]);
});

module.exports = app;
