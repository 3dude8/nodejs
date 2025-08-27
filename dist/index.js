"use strict";
// src/index.ts
/// <reference path="./types/express-session.d.ts" />
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config"); // Load environment variables from .env file
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./config/db"));
const express_handlebars_1 = require("express-handlebars");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const dashboardRoutes_1 = __importDefault(require("./routes/dashboardRoutes"));
const postRoutes_1 = __importDefault(require("./routes/postRoutes"));
const commentRoutes_1 = __importDefault(require("./routes/commentRoutes"));
const postController_1 = require("./controllers/postController");
const path_1 = __importDefault(require("path"));
(0, db_1.default)();
const app = (0, express_1.default)();
const PORT = 3000;
// Handlebars view engine setup
app.engine('hbs', (0, express_handlebars_1.engine)({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: path_1.default.join(__dirname, 'views/layouts'),
    partialsDir: path_1.default.join(__dirname, 'views/partials'),
    helpers: {
        formatDate: function (date) {
            return new Date(date).toLocaleDateString();
        },
        truncate: function (str, length) {
            if (!str)
                return ''; // guard against null/undefined
            if (str.length <= length)
                return str;
            return str.substring(0, length) + '...';
        },
        includes: function (array, item) {
            return array && array.includes(item);
        },
        eq: function (a, b) {
            return a === b;
        },
        add: function (a, b) {
            return a + b;
        },
        subtract: function (a, b) {
            return a - b;
        }
    }
}));
app.set('view engine', 'hbs');
app.set('views', path_1.default.join(__dirname, 'views'));
// Middleware
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// Debug: Log all requests before static files
app.use((req, res, next) => {
    console.log(`[PRE-STATIC] ${req.method} ${req.url}`);
    next();
});
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
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
app.use((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.jwt_token;
        if (token) {
            const jwt = require('jsonwebtoken');
            const JWT_SECRET = process.env.JWT_SECRET || 'SecretKey';
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = decoded;
            res.locals.currentUser = decoded;
        }
        else {
            res.locals.currentUser = null;
        }
    }
    catch (err) {
        res.locals.currentUser = null;
    }
    next();
}));
// Routes
// Use specific base paths for your API routes to avoid conflicts
app.use('/api/users', userRoutes_1.default);
app.use('/api/auth', authRoutes_1.default);
app.use('/dashboard', dashboardRoutes_1.default);
app.use('/api/posts', postRoutes_1.default);
app.use('/api/comments', commentRoutes_1.default);
// View routes for posts (these will render the Handlebars templates)
// IMPORTANT: More specific routes must come BEFORE general routes
app.get('/create-post', postController_1.renderCreatePostPage); // Changed to avoid conflicts
app.get('/posts/:id', postController_1.getPost); // Individual post view
app.get('/posts', postController_1.renderPostsPage);
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
