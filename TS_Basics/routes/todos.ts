import {Todo} from '../models/todo'

import {Router} from 'express'

const todos:Todo[]=[]
const router=Router()

router.get('/',(req,res,next)=>{
    res.status(200).json({todos:todos})
})

router.post('/todo',(req,res,next)=>{
    const newTodo:Todo = {
        id:new Date().toISOString(),
        text:req.body.text
    }
    todos.push(newTodo)
    res.status(201).json({msg:'Successfully added'})
})

router.post('/delete/:id',(req,res,next)=>{
    const id = req.params.id
    const delIndex = todos.findIndex((todo) => todo.id === id);
    if (delIndex !== -1) 
    { 
        todos.splice(delIndex, 1);
        res.status(201).json({msg: "Deleted"})
    }
    else 
    {
        res.status(404).json({msg: "Note not found"})
    }

})

router.post('/edit/:id/:newText',(req,res,next)=>{
    const id = req.params.id
    const newText = req.params.newText
    const editTodo = todos.find((todo) => todo.id === id);
    if (editTodo) 
    { 
        editTodo.text=newText
        res.status(201).json({msg: "Updated"})
    }
    else 
    {
        res.status(404).json({msg: "Note not found"})
    }

})

export default router