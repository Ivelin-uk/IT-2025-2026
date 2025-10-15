// server.js
const express = require('express');
const app = express();

app.get('/api/users', (req, res) => {
    res.json({ users: ['Иван', 'Мария'] });
});

app.listen(3000, () => {
    console.log('Сървър работи на порт 3000');
});