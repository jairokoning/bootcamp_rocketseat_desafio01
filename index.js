const express = require("express");
const server = express();

server.use(express.json());

var requestCount = 0;

const projects = new Array(
  {
    id: "1",
    title: "Desafio 01",
    tasks: ["Inicio do Projeto", "Implementar Backend", "Projeto Finalizado"]
  },
  { id: "2", title: "Desafio 02", tasks: ["Inicio do Projeto"] }
);

server.use((req, res, next) => {
  requestCount++;
  console.log(`Request Count: ${requestCount}`);
  return next();
});

function checkIdExists(req, res, next) {
  const { id } = req.params;
  const index = projects.map(el => el.id).indexOf(id);

  if (index < 0) {
    return res.status(400).json({ error: "Project not exists" });
  }

  req.params.index = index;

  return next();
}

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.post("/projects", (req, res) => {
  const { id, title, tasks } = req.body;

  projects.push({ id: id, title: title, tasks: tasks });
  return res.json(projects);
});

server.put("/projects/:id", checkIdExists, (req, res) => {
  const id = req.params.id;
  const { title } = req.body;

  projects.forEach(project => {
    if (project.id === id) {
      project.title = title;
    }
  });

  return res.json(projects);
});

server.delete("/projects/:id", checkIdExists, (req, res) => {
  const { id, index } = req.params;

  projects.splice(index, 1);

  return res.json({ message: `Project ${id} deleted` });
});

server.post("/projects/:id/tasks", checkIdExists, (req, res) => {
  const index = req.params.index;
  const { title } = req.body;

  projects[index].tasks.push(title);

  return res.json(projects);
});

server.listen(3000);
