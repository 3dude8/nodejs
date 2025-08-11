// src/index.ts

import express from 'express';
import connectDB from './config/db';
import { engine } from 'express-handlebars';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import path from 'path';

connectDB();
const app = express();
const PORT = 3000;

// Handlebars view engine setup
app.engine('hbs', engine({
  extname: '.hbs', 
  defaultLayout: 'main', 
  layoutsDir: path.join(__dirname, 'views/layouts'), 
  partialsDir: path.join(__dirname, 'views/partials') 
}));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
// Use specific base paths for your API routes to avoid conflicts
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

// Root route to render a Handlebars view
app.get('/', (req, res) => {
  res.render('login', { pageTitle: 'Login' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});