import { Request, Response } from 'express';
import { authenticateUser } from '../services/authServices';

export const loginUser = (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = authenticateUser(email, password);
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  res.json({
    message: "Login successful",
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  });
};

export const logoutUser = (req: Request, res: Response) => {


    console.log('User logged out');
    res.redirect('/');
};