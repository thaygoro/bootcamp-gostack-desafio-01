const express = require('express');

const server = express();

server.use(express.json());

// contador de requisições
let numberOfRequisitions = 0;

// Array inicial de projetos
const projects = [
  {
    "id": "0",
    "title": "Projeto Teste",
    "tasks": [
      "Tarefa 01",
      "Tarefa 02",
      "Tarefa 03"
    ]
  },
  {
    "id": "1",
    "title": "Projeto GoStack",
    "tasks": [
      "Brainstorm",
      "Planejar",
      "Executar"
    ]
  },
  {
    "id": "2",
    "title": "Projeto Filmes",
    "tasks": [
      "Poderoso Chefão",
      "Matrix",
      "Inception"
    ]
  }
];

/* ***** MIDDLEWARES ***** */

// Crie um middleware que será utilizado em todas rotas que recebem o ID do projeto nos parâmetros da URL que verifica se o projeto com aquele ID existe. Se não existir retorne um erro, caso contrário permita a requisição continuar normalmente;
function verifyIfProjectExists(req, res, next){
  const { id } = req.params;

  if(!projects[id]){
    // Código HTTP 400 = Bad request
    return res.status(400).json({error: 'id not found'});
  }

  return next();
}

// Crie um middleware global chamado em todas requisições que imprime (console.log) uma contagem de quantas requisições foram feitas na aplicação até então;
function countRequisitions(req, res, next){
  numberOfRequisitions++;
  
  console.log(`Requisição: ${req.method}, Contador de requisições = ${numberOfRequisitions}`);

  return next();
}

server.use(countRequisitions);

/* ***** End MIDDLEWARES ***** */

// POST /projects: A rota deve receber id e title dentro do corpo e cadastrar um novo projeto dentro de um array no seguinte formato: { id: "1", title: 'Novo projeto', tasks: [] }; Certifique-se de enviar tanto o ID quanto o título do projeto no formato string com aspas duplas.
server.post('/projects', (req, res) => {
  const { id } = req.body;
  const { title } = req.body;
  const { tasks } = req.body;

  projects.push({'id': id, 'title': title, 'tasks': tasks});

  return res.json(projects);
});

// GET /projects: Rota que lista todos projetos e suas tarefas;
server.get('/projects', (req, res) => {
  return res.json(projects);
});

// PUT /projects/:id: A rota deve alterar apenas o título do projeto com o id presente nos parâmetros da rota;
server.put('/projects/:id', verifyIfProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  projects[id].title = title;

  return res.json(projects);
});

// DELETE /projects/:id: A rota deve deletar o projeto com o id presente nos parâmetros da rota;
server.delete('/projects/:id', verifyIfProjectExists, (req, res) => {
  const { id } = req.params;

  projects.splice(id, 1);

  return res.json(projects);
});

// POST /projects/:id/tasks: A rota deve receber um campo title e armazenar uma nova tarefa no array de tarefas de um projeto específico escolhido através do id presente nos parâmetros da rota;
server.post('/projects/:id/tasks', verifyIfProjectExists, (req, res) => {
  const { id } = req.params;
  const newTask = req.body.title;

  projects[id].tasks.push(newTask);

  return res.json(projects);
});


server.listen('3000');