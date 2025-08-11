"use strict";
// src/index.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./config/db"));
const express_handlebars_1 = require("express-handlebars");
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const path_1 = __importDefault(require("path"));
(0, db_1.default)();
const app = (0, express_1.default)();
const PORT = 3000;
// Handlebars view engine setup
app.engine('hbs', (0, express_handlebars_1.engine)({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: path_1.default.join(__dirname, 'views/layouts'),
    partialsDir: path_1.default.join(__dirname, 'views/partials')
}));
app.set('view engine', 'hbs');
app.set('views', path_1.default.join(__dirname, 'views'));
// Middleware
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
// Routes
// Use specific base paths for your API routes to avoid conflicts
app.use('/api/users', userRoutes_1.default);
app.use('/api/auth', authRoutes_1.default);
// Root route to render a Handlebars view
app.get('/', (req, res) => {
    res.render('login', { pageTitle: 'Login' });
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
