import express from 'express';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 3000;
const usersFilePath = path.join(__dirname, 'data', 'users.json');

app.use(express.json());

const readUsers = (): any[] => {
  const data = fs.readFileSync(usersFilePath, 'utf-8');
  return JSON.parse(data);
};

const writeUsers = (users: any[]) => {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
};

app.get('/users', (req, res) => {
  const users = readUsers();
  res.json(users);
});

app.get('/users/:id', (req, res) => {
  const users = readUsers();
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

app.post('/users', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password || password.length < 6) {
    return res.status(400).json({ message: 'Invalid input' });
  }

  const users = readUsers();
  const newUser = {
    id: users.length ? users[users.length - 1].id + 1 : 1,
    name,
    email,
    password
  };
  users.push(newUser);
  writeUsers(users);
  res.status(201).json(newUser);
});

//  Update a User
app.put('/users/:id', (req, res) => {
  const users = readUsers();
  const index = users.findIndex(u => u.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: "User not found" });

  const { name, email, password } = req.body;
  if (password && password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  users[index] = {
    ...users[index],
    ...(name && { name }),
    ...(email && { email }),
    ...(password && { password })
  };

  writeUsers(users);
  res.json(users[index]);
});

//  Delete a User
app.delete('/users/:id', (req, res) => {
  const users = readUsers();
  const index = users.findIndex(u => u.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: "User not found" });

  const deletedUser = users.splice(index, 1)[0];
  writeUsers(users);
  res.json(deletedUser);
});

// Start Server
app.listen(3000, () => {
  console.log(`Server running on http://localhost:3000`);
});
