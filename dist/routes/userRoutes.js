"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_1 = require("../types/users");
const userServices_1 = require("../services/userServices");
const router = (0, express_1.Router)();
router.get('/users', (req, res) => {
    const users = (0, userServices_1.readUsers)();
    res.json(users);
});
router.get('/users/:id', (req, res) => {
    const users = (0, userServices_1.readUsers)();
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user)
        return res.status(404).json({ message: "User not found" });
    res.json(user);
});
router.post('/users', (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password || password.length < 6) {
        return res.status(400).json({ message: 'Invalid input' });
    }
    const users = (0, userServices_1.readUsers)();
    const newUser = new users_1.User(users.length ? users[users.length - 1].id + 1 : 1, name, email, password);
    users.push(newUser);
    (0, userServices_1.writeUsers)(users);
    res.status(201).json(newUser);
});
router.put('/users/:id', (req, res) => {
    const users = (0, userServices_1.readUsers)();
    const index = users.findIndex(u => u.id === parseInt(req.params.id));
    if (index === -1)
        return res.status(404).json({ message: "User not found" });
    const { name, email, password } = req.body;
    if (password && password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    users[index] = new users_1.User(users[index].id, name || users[index].name, email || users[index].email, password || users[index].password);
    (0, userServices_1.writeUsers)(users);
    res.json(users[index]);
});
router.delete('/users/:id', (req, res) => {
    const users = (0, userServices_1.readUsers)();
    const index = users.findIndex(u => u.id === parseInt(req.params.id));
    if (index === -1)
        return res.status(404).json({ message: "User not found" });
    const deletedUser = users.splice(index, 1)[0];
    (0, userServices_1.writeUsers)(users);
    res.json(deletedUser);
});
//  the search route
router.get('/users/search', (req, res) => {
    const query = (req.query.query || '').toLowerCase();
    const users = (0, userServices_1.readUsers)();
    const filtered = users.filter(u => u.name.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query)).map(u => ({
        id: u.id,
        name: u.name,
        email: u.email
    }));
    res.json(filtered);
});
exports.default = router;
