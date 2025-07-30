import fs from 'fs';
import path from 'path';
import { User } from '../types/users';

const usersFilePath = path.join(__dirname, '../data/users.json');

type UserRaw = { id: number; name: string; email: string; password: string };

export const readUsers = (): User[] => {
  const data = fs.readFileSync(usersFilePath, 'utf-8');
  const users = JSON.parse(data) as UserRaw[];
  return users.map(u => new User(u.id, u.name, u.email, u.password));
};

export const writeUsers = (users: User[]) => {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
};