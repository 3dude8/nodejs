// src/index.ts
/// <reference path="./types/express-session.d.ts" />

import express from 'express';
import connectDB from './config/db';
import { isAuthenticated } from './middleware/auth';

import { engine } from 'express-handlebars';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import postRoutes from './routes/postRoutes';
import commentRoutes from './routes/commentRoutes';
import { renderPostsPage, renderCreatePostPage, getPost } from './controllers/postController';
import path from 'path';

connectDB();
const app = express();
const PORT = 3000;

// Handlebars view engine setup
app.engine('hbs', engine({
  extname: '.hbs', 
  defaultLayout: 'main', 
  layoutsDir: path.join(__dirname, 'views/layouts'), 
  partialsDir: path.join(__dirname, 'views/partials'),
  helpers: {
    formatDate: function(date: Date) {
      return new Date(date).toLocaleDateString();
    },
   truncate: function(str: string, length: number) {
  if (!str) return '';   // guard against null/undefined
  if (str.length <= length) return str;
  return str.substring(0, length) + '...';
},

    includes: function(array: any[], item: any) {
      return array && array.includes(item);
    },
    eq: function(a: any, b: any) {
      return a === b;
    },
    add: function(a: number, b: number) {
      return a + b;
    },
    subtract: function(a: number, b: number) {
      return a - b;
    }
  }
}));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Debug: Log all requests before static files
app.use((req, res, next) => {
  console.log(`[PRE-STATIC] ${req.method} ${req.url}`);
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

// Debug: Log all requests after static files
app.use((req, res, next) => {
  console.log(`[POST-STATIC] ${req.method} ${req.url}`);
  next();
});



// Method override for PUT/DELETE requests from forms
app.use((req, res, next) => {
  if (req.body && req.body._method) {
    req.method = req.body._method;
    delete req.body._method;
  }
  next();
});

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log(`Query params:`, req.query);
  next();
});

// Session middleware removed - using JWT tokens instead

// JWT Authentication middleware to populate user from token
app.use(async (req: any, res, next) => {
  try {
    const token = req.cookies.jwt_token;
    if (token) {
      const jwt = require('jsonwebtoken');
      const JWT_SECRET = process.env.JWT_SECRET || 'SecretKey';
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string; name: string; email: string };
      req.user = decoded;
      res.locals.currentUser = decoded;
    } else {
      res.locals.currentUser = null;
    }
  } catch (err) {
    res.locals.currentUser = null;
  }
  next();
});



// Routes
// Use specific base paths for your API routes to avoid conflicts
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);

// View routes for posts (these will render the Handlebars templates)
// IMPORTANT: More specific routes must come BEFORE general routes
app.get('/create-post', renderCreatePostPage); // Changed to avoid conflicts
app.get('/posts/:id', getPost); // Individual post view
app.get('/posts', renderPostsPage);

// Debug: Add a simple test route to see if routing works
app.get('/debug-test', (req, res) => {
  console.log('=== DEBUG TEST ROUTE WORKING ===');
  res.send('Debug route working!');
});

// Test route to see if the function is being called
app.get('/test-create', (req, res) => {
  console.log('=== TEST ROUTE CALLED ===');
  console.log('Query params:', req.query);
  res.send('Test route working!');
});

// Root route to render a Handlebars view
app.get('/', (req, res) => {
  res.render('login', { pageTitle: 'Login' });
});

// Login page route
app.get('/login', (req, res) => {
  res.render('login', { pageTitle: 'Login' });
});

// Registration page route
app.get('/register', (req, res) => {
  res.render('register', { pageTitle: 'Register' });
});

// Logout route
app.get('/logout', (req, res) => {
  // Clear the JWT cookie
  res.clearCookie('jwt_token');
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});