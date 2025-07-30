"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const app = (0, express_1.default)();
const PORT = 3000;
app.use(express_1.default.json());
app.use(userRoutes_1.default);
app.use(authRoutes_1.default);
app.get('/', (req, res) => {
    res.send('API is running!');
});
app.listen(3000, () => {
    console.log(`Server running on http://localhost:3000`);
});
