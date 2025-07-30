import { readUsers } from './userServices';
import { User } from '../types/users';

export const authenticateUser = (email: string, password: string): User | null => {
  const users = readUsers();
  const user = users.find(u => u.email === email && u.password === password);
  return user || null;
};