const express = require('express');
const app = express();
const pool = require('./db');

app.use(express.json()) // => req.body

// ROUTES //

//get all todo 
app.get("/todos", async (req, res) =>{
    try {
        const allTodos = await pool.query("SELECT * FROM todo");
        res.json(allTodos.rows);
    } catch (error) {
        console.error(error.message);
    }
})

// get a todo
app.get("/todos/:id", async (req, res) =>{
    const { id } = req.params;
    try {
        const todo = await pool.query("SELECT * FROM todo WHERE todo_id = $1",[id]);
        res.json(todo.rows[0]);
    } catch (error) {
        console.error(error.message);
    }
});
//create todo
app.post("/todos", async (req, res) =>{
    try {
        const {description} = req.body;
        const newTodo = await pool.query("INSERT INTO todo (description) VALUES($1) RETURNING *",[description]);
        res.json(newTodo.rows[0]);
        console.log(req.body);
    } catch (error) {
        console.error(error.message);
    }
});

//update todo 
app.put("/todos/:id", async (req, res) =>{
    try {
        const {id} = req.params;
        const {description} = req.body; // SET

        const updateTodo = await pool.query("UPDATE todo SET description = $1 WHERE todo_id = $2", [description,id]);
        res.json(updateTodo);
    } catch (error) {
        console.error(error.message);
    }
});

//delete todo
app.delete("/todos/:id", async (req, res) =>{
    try {
        const { id } = req.params;
        const deleteTodo = await pool.query("DELETE FROM todo WHERE todo_id = $1",[id]);
        res.json("Todo was successfully deleted.");
    } catch (error) {
        console.error(error.message);
    }
});

app.get("/", (req, res) =>{
    res.send("hello word");
})
app.listen(3000, () =>{
    console.log('server is listening on port 3000');
})