const express = require("express");
const server = express();
const { randomUUID } = require("crypto");
const fs = require("fs");

let users = [];

fs.readFile("users.json", "utf-8", (err, data) => {
    if (err) {
        console.log(err);
    } else {
        users = JSON.parse(data);
    }
})

server.use(express.json());

server.post("/user", (req, res) => {
    const {name, email} = req.body;
    const user = {id: randomUUID(), name, email}
    users.push(user);
    saveToFile();
    return res.json(user);
})

server.get("/user", (req, res) => {
    return res.json(users);
})

server.get("/user/:id", (req, res) => {
    const {id} = req.params;
    const user = users.find((user) => user.id === id);
    return res.json(user);
})

server.put("/user/:id", (req, res) => {
    const {id} = req.params;
    const {name, email} = req.body;
    const userIndex = users.findIndex((user) => user.id === id);
    users[userIndex] = {
        ...users[userIndex],
        name,
        email
    };
    saveToFile();
    return res.json("Alteração realizada.");
})

server.delete("/user/:id", (req, res) => {
    const {id} = req.params;
    const userIndex = users.findIndex((user) => user.id === id);
    users.splice(userIndex, 1);
    saveToFile();
    return res.json("Remoção realizada.");
})

function saveToFile() {
    fs.writeFile("users.json", JSON.stringify(users), (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Gravado no arquivo.");
        }
    });
}

server.listen(4001, () => console.log("Servidor inciado na porta 4001"));
