"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const todos = [];
const router = (0, express_1.Router)();
router.get('/', (req, res, next) => {
    res.status(200).json({ todos: todos });
});
router.post('/todo', (req, res, next) => {
    const body = req.body;
    const newTodo = {
        id: new Date().toISOString(),
        text: body.text
    };
    todos.push(newTodo);
    res.status(201).json({ msg: 'Successfully added' });
});
router.post('/delete/:id', (req, res, next) => {
    const params = req.params;
    const id = params.id;
    const delIndex = todos.findIndex((todo) => todo.id === id);
    if (delIndex !== -1) {
        todos.splice(delIndex, 1);
        res.status(201).json({ msg: "Deleted" });
    }
    else {
        res.status(404).json({ msg: "Note not found" });
    }
});
router.post('/edit/:id/', (req, res, next) => {
    const body = req.body;
    const id = req.params.id;
    const newText = req.body.text;
    const editTodo = todos.find((todo) => todo.id === id);
    if (editTodo) {
        editTodo.text = newText;
        res.status(201).json({ msg: "Updated" });
    }
    else {
        res.status(404).json({ msg: "Note not found" });
    }
});
exports.default = router;
