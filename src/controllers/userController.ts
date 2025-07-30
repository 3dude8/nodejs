import { Request, Response } from 'express';
import { User } from '../types/users';
import { readUsers, writeUsers } from '../services/userServices';

export const getAllUsers = (req: Request, res: Response) => {
  const users = readUsers();
  res.json(users);
};

export const getUserById = (req: Request, res: Response) => {
  const users = readUsers();
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};

export const createUser = (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password || password.length < 6) {
    return res.status(400).json({ message: 'Invalid input' });
  }
  const users = readUsers();
  const newUser = new User(
    users.length ? users[users.length - 1].id + 1 : 1,
    name,
    email,
    password
  );
  users.push(newUser);
  writeUsers(users);
  res.status(201).json(newUser);
};

export const updateUser = (req: Request, res: Response) => {
  const users = readUsers();
  const index = users.findIndex(u => u.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: "User not found" });

  const { name, email, password } = req.body;
  if (password && password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  users[index] = new User(
    users[index].id,
    name || users[index].name,
    email || users[index].email,
    password || users[index].password
  );

  writeUsers(users);
  res.json(users[index]);
};

export const deleteUser = (req: Request, res: Response) => {
  const users = readUsers();
  const index = users.findIndex(u => u.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: "User not found" });

  const deletedUser = users.splice(index, 1)[0];
  writeUsers(users);
  res.json(deletedUser);
};

export const searchUsers = (req: Request, res: Response) => {
  const query = (req.query.query as string || '').toLowerCase();
  const users = readUsers();
  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(query) ||
    u.email.toLowerCase().includes(query)
  ).map(u => ({
    id: u.id,
    name: u.name,
    email: u.email
  }));
  res.json(filtered);
};