const express = require("express");
const cors = require("cors");

const app = express();
var router = express.Router();

app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

let users = [
  {
    id: 32165,
    nome: "Lucas",
    empresa: "Keller Williams",
    permissao: "ADMIN",
  },
  {
    id: 14564,
    nome: "Aline",
    empresa: "Keller Williams",
    permissao: "USER",
  },
  {
    id: 22314,
    nome: "Bruno",
    empresa: "Keller Williams",
    permissao: "USER",
  },
];

function isAdmin(req, res, next) {
  let { calledId } = req.params;

  console.log(calledId);
  

  let userFound = users.find((user) => user.id == calledId);

  if (userFound && userFound.permissao == "ADMIN")
    return next();
  

  res.status(401).send({
      error: "unauthorized",
  });
}

router.get("/:calledId", function(req, res){
  let { calledId } = req.params;

  let userFound = users.find((user) => user.id == calledId);

  if (!userFound)
      return res.status(400).send({
          error: "user not found",
      });

  res.status(200).send(userFound);
});

router.patch("/:calledId/:id", function (req, res) {
  let { id } = req.params;

  let userToUpdate = req.body || {};

  let userIndexFound = users.findIndex((user) => user.id == id);

  if (userIndexFound < 0)
      return res.status(400).send({
          error: "user not found",
      });

  users[userIndexFound] = { ...users[userIndexFound], ...userToUpdate };

  res.status(200).send(users[userIndexFound]);
});

router.post("/:calledId", isAdmin, function (req, res) {
  let newUser = req.body;

  if (!newUser.id || !newUser.nome || !newUser.empresa || !newUser.permissao)
      return res.status(400).send({
          error: "Bad request. Field not found (id, nome, empresa, permissao)",
      });

  let userFound = users.find((user) => user.id == newUser.id);

  if (userFound)
      return res.status(409).send({
          error: "user duplicate",
      });

  users.push(newUser);

  res.status(201).send(newUser);
});

router.delete("/:calledId/:id", isAdmin, function (req, res) {
  let { id } = req.params;

  let userIndexFound = users.findIndex((user) => user.id == id);

  if (userIndexFound < 0)
      return res.status(400).send({
          error: "user not found",
      });

  users.splice(userIndexFound, 1);

  res.status(200).send();
});

app.use("/users", router);
app.listen(3000);
