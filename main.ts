import { Hono } from "https://deno.land/x/hono@v3.0.0/mod.ts";
import { MongoClient, Bson } from "https://deno.land/x/mongo@v0.32.0/mod.ts";
import { serve } from "https://deno.land/std/http/server.ts";

const app = new Hono();

// MongoDB Connection
const client = new MongoClient();
await client.connect("mongodb://mongo:27017"); // use Docker container name as hostname
const db = client.database('todoApp');
const todosCollection = db.collection('todos');

// Routes

// Route to serve index.html
app.get('/', async (c) => {
  const file = await Deno.readFile('index.html'); // Read the index.html file
  return new Response(file, { headers: { "Content-Type": "text/html" }, status: 200 }); // Explicitly set status to 200
});

// Get all todos
app.get('/todos', async (c) => {
  const todos = await todosCollection.find().toArray();
  return c.json(todos);
});

// Create a new todo
app.post('/todos', async (c) => {
  const body = await c.req.json();
  const newTodo = {
    text: body.text,
    completed: false,
  };
  await todosCollection.insertOne(newTodo);
  return c.json({ message: 'Todo created', todo: newTodo });
});

// Update a todo
app.put('/todos/:id', async (c) => {
  const { id } = c.req.param();
  const body = await c.req.json();

  try {
    const objectId = new Bson.ObjectId(id); // Convert string id to ObjectId
    const updatedCount = await todosCollection.updateOne(
      { _id: objectId },
      { $set: body }
    );

    if (updatedCount === 0) {
      return c.json({ message: 'Todo not found' }, 404);
    }

    return c.json({ message: 'Todo updated' });
  } catch (error) {
    return c.json({ message: 'Invalid ID format' }, 400);
  }
});

// Update a todo's completed status
app.put('/todos/:id/toggle', async (c) => {
  const { id } = c.req.param();
  try {
    const objectId = new Bson.ObjectId(id); // Convert string id to ObjectId
    const todo = await todosCollection.findOne({ _id: objectId });
    if (!todo) {
      return c.json({ message: 'Todo not found' }, 404);
    }
    const updatedTodo = await todosCollection.updateOne(
      { _id: objectId },
      { $set: { completed: !todo.completed } }
    );
    return c.json({ message: 'Todo updated', updatedTodo });
  } catch (error) {
    return c.json({ message: 'Invalid ID format' }, 400);
  }
});

// Delete a todo
app.delete('/todos/:id', async (c) => {
  const { id } = c.req.param();
  try {
    const objectId = new Bson.ObjectId(id); // Convert string id to ObjectId
    const deleteCount = await todosCollection.deleteOne({ _id: objectId });
    if (deleteCount === 0) {
      return c.json({ message: 'Todo not found' }, 404);
    }
    return c.json({ message: 'Todo deleted' });
  } catch (error) {
    return c.json({ message: 'Invalid ID format' }, 400);
  }
});

serve(app.fetch, { hostname: "0.0.0.0", port: 3000 }); // hostname required for Docker
